// Main Application Controller
class MicroChallengeApp {
    constructor() {
        this.currentView = 'welcome';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthState();
        this.updateUI();
    }

    bindEvents() {
        // Navigation events
        document.getElementById('loginBtn').addEventListener('click', () => this.showAuth('login'));
        document.getElementById('signupBtn').addEventListener('click', () => this.showAuth('signup'));
        document.getElementById('getStartedBtn').addEventListener('click', () => this.showAuth('signup'));
        document.getElementById('learnMoreBtn').addEventListener('click', () => this.scrollToFeatures());

        // Auth form switching
        document.getElementById('showSignupForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('signup');
        });
        document.getElementById('showLoginForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupFormElement').addEventListener('submit', (e) => this.handleSignup(e));

        // Dashboard events
        document.getElementById('completeBtn').addEventListener('click', () => this.completeChallenge());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipChallenge());
        document.getElementById('viewProgressBtn').addEventListener('click', () => this.showProgress());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('backToDashboardBtn').addEventListener('click', () => this.showDashboard());

        // Password strength checker
        document.getElementById('signupPassword').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
    }

    checkAuthState() {
        if (authManager.isLoggedIn()) {
            this.currentView = 'dashboard';
        } else {
            this.currentView = 'welcome';
        }
    }

    updateUI() {
        // Hide all sections
        document.getElementById('welcomeSection').classList.add('hidden');
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.add('hidden');
        document.getElementById('progressSection').classList.add('hidden');

        // Update navigation
        const nav = document.getElementById('nav');
        
        if (authManager.isLoggedIn()) {
            nav.innerHTML = `
                <span style="color: white; margin-right: 20px;">Welcome, ${authManager.getCurrentUser().name}!</span>
                <button class="btn btn-outline" id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        } else {
            nav.innerHTML = `
                <button class="btn btn-primary" id="loginBtn">Login</button>
                <button class="btn btn-secondary" id="signupBtn">Sign Up</button>
            `;
            document.getElementById('loginBtn').addEventListener('click', () => this.showAuth('login'));
            document.getElementById('signupBtn').addEventListener('click', () => this.showAuth('signup'));
        }

        // Show appropriate section
        switch (this.currentView) {
            case 'welcome':
                document.getElementById('welcomeSection').classList.remove('hidden');
                break;
            case 'auth':
                document.getElementById('authSection').classList.remove('hidden');
                break;
            case 'dashboard':
                document.getElementById('dashboardSection').classList.remove('hidden');
                this.loadDashboard();
                break;
            case 'progress':
                document.getElementById('progressSection').classList.remove('hidden');
                this.loadProgress();
                break;
        }
    }

    showAuth(type = 'login') {
        this.currentView = 'auth';
        this.updateUI();
        this.switchAuthForm(type);
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (type === 'signup') {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        } else {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        try {
            this.setLoading(submitBtn, true);
            this.clearMessages();

            await authManager.login(email, password);
            
            this.showSuccess('Login successful! Welcome back!');
            setTimeout(() => {
                this.currentView = 'dashboard';
                this.updateUI();
            }, 1000);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        try {
            this.setLoading(submitBtn, true);
            this.clearMessages();

            await authManager.register(name, email, password, confirmPassword);
            
            this.showSuccess('Account created successfully! Welcome to Daily Micro Challenges!');
            setTimeout(() => {
                this.currentView = 'dashboard';
                this.updateUI();
            }, 1000);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    loadDashboard() {
        const user = authManager.getCurrentUser();
        const challenge = challengeManager.getTodaysChallenge();
        
        // Update user info
        document.getElementById('userName').textContent = user.name;
        
        // Update stats
        document.getElementById('currentStreak').textContent = progressTracker.getCurrentStreak();
        document.getElementById('totalCompleted').textContent = progressTracker.getTotalCompleted();
        
        // Update challenge info
        document.getElementById('challengeDate').textContent = new Date().toLocaleDateString('en', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('challengeIcon').textContent = challenge.icon;
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengeDescription').textContent = challenge.description;
        
        // Update challenge status
        const isCompleted = progressTracker.isTodayCompleted();
        const isSkipped = progressTracker.isTodaySkipped();
        
        const completeBtn = document.getElementById('completeBtn');
        const skipBtn = document.getElementById('skipBtn');
        const statusDiv = document.getElementById('challengeStatus');
        
        if (isCompleted) {
            completeBtn.style.display = 'none';
            skipBtn.style.display = 'none';
            statusDiv.classList.remove('hidden');
            statusDiv.innerHTML = `
                <div class="status-complete">
                    <span class="status-icon">✅</span>
                    <span>Challenge completed! Great job!</span>
                </div>
            `;
        } else if (isSkipped) {
            completeBtn.style.display = 'none';
            skipBtn.style.display = 'none';
            statusDiv.classList.remove('hidden');
            statusDiv.innerHTML = `
                <div class="status-complete" style="background: #fef3c7; border-left-color: #f59e0b;">
                    <span class="status-icon">⏭️</span>
                    <span style="color: #92400e;">Challenge skipped. Try again tomorrow!</span>
                </div>
            `;
        } else {
            completeBtn.style.display = 'block';
            skipBtn.style.display = 'block';
            statusDiv.classList.add('hidden');
        }
    }

    completeChallenge() {
        if (progressTracker.completeToday()) {
            this.showSuccess('Congratulations! Challenge completed! 🎉');
            this.loadDashboard(); // Refresh dashboard
        } else {
            this.showError('Challenge already completed for today!');
        }
    }

    skipChallenge() {
        if (confirm('Are you sure you want to skip today\'s challenge? This will reset your streak.')) {
            if (progressTracker.skipToday()) {
                this.showSuccess('Challenge skipped. See you tomorrow! 👋');
                this.loadDashboard(); // Refresh dashboard
            } else {
                this.showError('Challenge already completed or skipped for today!');
            }
        }
    }

    showProgress() {
        this.currentView = 'progress';
        this.updateUI();
    }

    loadProgress() {
        // Load week grid
        const weekGrid = document.getElementById('weekGrid');
        const weekProgress = progressTracker.getWeekProgress();
        
        weekGrid.innerHTML = weekProgress.map(day => `
            <div class="day-cell ${day.progress?.status === 'completed' ? 'completed' : ''} ${day.isToday ? 'today' : ''}" 
                 title="${day.dayName} ${day.day}${day.progress ? ` - ${day.progress.status}` : ''}">
                ${day.day}
            </div>
        `).join('');

        // Load recent challenges
        const recentChallenges = document.getElementById('recentChallenges');
        const recent = progressTracker.getRecentChallenges();
        
        recentChallenges.innerHTML = recent.map(item => `
            <div class="recent-challenge">
                <div class="recent-challenge-icon">${item.challenge.icon}</div>
                <div class="recent-challenge-text">
                    <div class="recent-challenge-title">${item.challenge.title}</div>
                    <div class="recent-challenge-date">${new Date(item.date).toLocaleDateString()}</div>
                </div>
                <div class="recent-challenge-status ${item.progress?.status || 'pending'}">
                    ${item.progress?.status === 'completed' ? '✅ Completed' : 
                      item.progress?.status === 'skipped' ? '⏭️ Skipped' : 
                      item.isToday ? '⏳ Today' : '⚪ Missed'}
                </div>
            </div>
        `).join('');
    }

    showDashboard() {
        this.currentView = 'dashboard';
        this.updateUI();
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            authManager.logout();
            this.currentView = 'welcome';
            this.updateUI();
            this.showSuccess('Logged out successfully!');
        }
    }

    scrollToFeatures() {
        document.querySelector('.features').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    checkPasswordStrength(password) {
        const strength = authManager.checkPasswordStrength(password);
        const container = document.getElementById('signupPassword').parentNode;
        
        // Remove existing strength indicator
        const existing = container.querySelector('.password-strength');
        if (existing) existing.remove();
        
        if (password.length > 0) {
            const strengthHTML = `
                <div class="password-strength">
                    <div class="password-strength-bar ${strength.level}"></div>
                </div>
                <div class="password-strength-text ${strength.level}">
                    Password strength: ${strength.level}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', strengthHTML);
        }
    }

    setLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    showError(message) {
        this.clearMessages();
        const authSection = document.getElementById('authSection');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        authSection.insertBefore(errorDiv, authSection.firstChild);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        this.clearMessages();
        const authSection = document.getElementById('authSection');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        authSection.insertBefore(successDiv, authSection.firstChild);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for challenges to load
    setTimeout(() => {
        window.app = new MicroChallengeApp();
    }, 100);
});

