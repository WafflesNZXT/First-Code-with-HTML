// Challenge Management System
class ChallengeManager {
    constructor() {
        this.challenges = [];
        this.loadChallenges();
    }

    async loadChallenges() {
        try {
            const response = await fetch('data/challenges.json');
            this.challenges = await response.json();
        } catch (error) {
            console.error('Error loading challenges:', error);
            // Fallback challenges if file can't be loaded
            this.challenges = [
                {
                    id: 1,
                    title: "Drink a glass of water",
                    description: "Hydrate your body with a refreshing glass of water. Your body will thank you!",
                    category: "wellness",
                    icon: "💧",
                    difficulty: "easy"
                },
                {
                    id: 2,
                    title: "Take 5 deep breaths",
                    description: "Practice mindful breathing. Inhale slowly for 4 counts, hold for 4, then exhale for 4.",
                    category: "mental",
                    icon: "🌬️",
                    difficulty: "easy"
                },
                {
                    id: 3,
                    title: "Stretch for 1 minute",
                    description: "Take a moment to stretch your body. Focus on areas that feel tense or tight.",
                    category: "physical",
                    icon: "🧘",
                    difficulty: "easy"
                }
            ];
        }
    }

    // Get today's challenge based on date
    getTodaysChallenge() {
        const today = new Date();
        const dayOfYear = this.getDayOfYear(today);
        const challengeIndex = dayOfYear % this.challenges.length;
        return this.challenges[challengeIndex];
    }

    // Get challenge by ID
    getChallengeById(id) {
        return this.challenges.find(challenge => challenge.id === id);
    }

    // Get challenges by category
    getChallengesByCategory(category) {
        return this.challenges.filter(challenge => challenge.category === category);
    }

    // Get random challenge
    getRandomChallenge() {
        const randomIndex = Math.floor(Math.random() * this.challenges.length);
        return this.challenges[randomIndex];
    }

    // Helper function to get day of year
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Get challenge for specific date
    getChallengeForDate(date) {
        const dayOfYear = this.getDayOfYear(date);
        const challengeIndex = dayOfYear % this.challenges.length;
        return this.challenges[challengeIndex];
    }

    // Get all challenges
    getAllChallenges() {
        return this.challenges;
    }

    // Get challenges by difficulty
    getChallengesByDifficulty(difficulty) {
        return this.challenges.filter(challenge => challenge.difficulty === difficulty);
    }

    // Search challenges by title or description
    searchChallenges(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.challenges.filter(challenge => 
            challenge.title.toLowerCase().includes(lowercaseQuery) ||
            challenge.description.toLowerCase().includes(lowercaseQuery)
        );
    }
}

// Progress tracking system
class ProgressTracker {
    constructor() {
        this.storageKey = 'microChallengeProgress';
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            completedChallenges: {},
            streak: 0,
            totalCompleted: 0,
            lastCompletedDate: null,
            joinDate: new Date().toISOString().split('T')[0]
        };
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    // Mark today's challenge as complete
    completeToday() {
        const today = new Date().toISOString().split('T')[0];
        const challenge = challengeManager.getTodaysChallenge();
        
        if (!this.progress.completedChallenges[today]) {
            this.progress.completedChallenges[today] = {
                challengeId: challenge.id,
                completedAt: new Date().toISOString(),
                status: 'completed'
            };
            
            this.progress.totalCompleted++;
            this.updateStreak();
            this.progress.lastCompletedDate = today;
            this.saveProgress();
            
            return true;
        }
        return false;
    }

    // Skip today's challenge
    skipToday() {
        const today = new Date().toISOString().split('T')[0];
        const challenge = challengeManager.getTodaysChallenge();
        
        if (!this.progress.completedChallenges[today]) {
            this.progress.completedChallenges[today] = {
                challengeId: challenge.id,
                skippedAt: new Date().toISOString(),
                status: 'skipped'
            };
            
            this.resetStreak();
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Check if today's challenge is completed
    isTodayCompleted() {
        const today = new Date().toISOString().split('T')[0];
        const todayProgress = this.progress.completedChallenges[today];
        return todayProgress && todayProgress.status === 'completed';
    }

    // Check if today's challenge is skipped
    isTodaySkipped() {
        const today = new Date().toISOString().split('T')[0];
        const todayProgress = this.progress.completedChallenges[today];
        return todayProgress && todayProgress.status === 'skipped';
    }

    // Update streak calculation
    updateStreak() {
        const today = new Date();
        let currentStreak = 0;
        let checkDate = new Date(today);

        // Count consecutive days backwards from today
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const dayProgress = this.progress.completedChallenges[dateStr];
            
            if (dayProgress && dayProgress.status === 'completed') {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        this.progress.streak = currentStreak;
    }

    // Reset streak
    resetStreak() {
        this.progress.streak = 0;
    }

    // Get current streak
    getCurrentStreak() {
        this.updateStreak(); // Recalculate to ensure accuracy
        return this.progress.streak;
    }

    // Get total completed challenges
    getTotalCompleted() {
        return this.progress.totalCompleted;
    }

    // Get progress for a specific date
    getProgressForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.progress.completedChallenges[dateStr] || null;
    }

    // Get recent challenges (last 7 days)
    getRecentChallenges() {
        const recent = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const challenge = challengeManager.getChallengeForDate(date);
            const progress = this.getProgressForDate(date);
            
            recent.push({
                date: dateStr,
                challenge: challenge,
                progress: progress,
                isToday: i === 0
            });
        }
        
        return recent;
    }

    // Get week progress for calendar view
    getWeekProgress() {
        const week = [];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const progress = this.getProgressForDate(date);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isFuture = date > today;
            
            week.push({
                date: dateStr,
                day: date.getDate(),
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                progress: progress,
                isToday: isToday,
                isFuture: isFuture
            });
        }
        
        return week;
    }

    // Clear all progress (for testing or reset)
    clearProgress() {
        this.progress = {
            completedChallenges: {},
            streak: 0,
            totalCompleted: 0,
            lastCompletedDate: null,
            joinDate: new Date().toISOString().split('T')[0]
        };
        this.saveProgress();
    }
}

// Initialize global instances
const challengeManager = new ChallengeManager();
const progressTracker = new ProgressTracker();

