// Authentication System
class AuthManager {
    constructor() {
        this.storageKey = 'microChallengeAuth';
        this.usersKey = 'microChallengeUsers';
        this.currentUser = this.loadCurrentUser();
        this.users = this.loadUsers();
    }

    loadCurrentUser() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }

    loadUsers() {
        const saved = localStorage.getItem(this.usersKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveCurrentUser(user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.currentUser = user;
    }

    saveUsers() {
        localStorage.setItem(this.usersKey, JSON.stringify(this.users));
    }

    // Simple email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simple password validation
    isValidPassword(password) {
        return password.length >= 6;
    }

    // Hash password (simple implementation - in production use proper hashing)
    hashPassword(password) {
        // Simple hash for demo purposes - use bcrypt or similar in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Register new user
    register(name, email, password, confirmPassword) {
        // Validation
        if (!name.trim()) {
            throw new Error('Name is required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!this.isValidPassword(password)) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Check if user already exists
        if (this.users[email]) {
            throw new Error('An account with this email already exists');
        }

        // Create new user
        const user = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Save user
        this.users[email] = user;
        this.saveUsers();

        // Auto-login after registration
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        this.saveCurrentUser(userSession);
        return userSession;
    }

    // Login user
    login(email, password) {
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!password) {
            throw new Error('Password is required');
        }

        const user = this.users[email.toLowerCase().trim()];
        if (!user) {
            throw new Error('No account found with this email address');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Incorrect password');
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();

        // Create session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        this.saveCurrentUser(userSession);
        return userSession;
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.storageKey);
        this.currentUser = null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.isLoggedIn()) {
            throw new Error('You must be logged in to update your profile');
        }

        const user = this.users[this.currentUser.email];
        if (!user) {
            throw new Error('User not found');
        }

        // Update allowed fields
        if (updates.name && updates.name.trim()) {
            user.name = updates.name.trim();
            this.currentUser.name = user.name;
        }

        user.updatedAt = new Date().toISOString();
        this.saveUsers();
        this.saveCurrentUser(this.currentUser);

        return this.currentUser;
    }

    // Change password
    changePassword(currentPassword, newPassword, confirmPassword) {
        if (!this.isLoggedIn()) {
            throw new Error('You must be logged in to change your password');
        }

        const user = this.users[this.currentUser.email];
        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== this.hashPassword(currentPassword)) {
            throw new Error('Current password is incorrect');
        }

        if (!this.isValidPassword(newPassword)) {
            throw new Error('New password must be at least 6 characters long');
        }

        if (newPassword !== confirmPassword) {
            throw new Error('New passwords do not match');
        }

        user.password = this.hashPassword(newPassword);
        user.updatedAt = new Date().toISOString();
        this.saveUsers();

        return true;
    }

    // Delete account
    deleteAccount(password) {
        if (!this.isLoggedIn()) {
            throw new Error('You must be logged in to delete your account');
        }

        const user = this.users[this.currentUser.email];
        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Password is incorrect');
        }

        // Delete user data
        delete this.users[this.currentUser.email];
        this.saveUsers();

        // Clear progress data
        localStorage.removeItem('microChallengeProgress');

        // Logout
        this.logout();

        return true;
    }

    // Get user statistics
    getUserStats() {
        if (!this.isLoggedIn()) {
            return null;
        }

        const user = this.users[this.currentUser.email];
        if (!user) {
            return null;
        }

        const joinDate = new Date(user.createdAt);
        const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));

        return {
            joinDate: joinDate.toLocaleDateString(),
            daysSinceJoin: daysSinceJoin,
            lastLogin: new Date(user.lastLogin).toLocaleDateString()
        };
    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push('Use at least 8 characters');
        }

        if (/[a-z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('Include lowercase letters');
        }

        if (/[A-Z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('Include uppercase letters');
        }

        if (/[0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('Include numbers');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('Include special characters');
        }

        let level = 'weak';
        if (strength >= 4) level = 'strong';
        else if (strength >= 2) level = 'medium';

        return {
            strength: strength,
            level: level,
            feedback: feedback
        };
    }
}

// Initialize global auth manager
const authManager = new AuthManager();

