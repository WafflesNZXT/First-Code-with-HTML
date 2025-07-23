# 🌟 Daily Micro Challenges

A wellness-focused web application that provides users with daily micro-challenges to build better habits and improve their overall well-being.

## ✨ Features

### 🔐 User Authentication
- **Sign Up & Login**: Secure user registration and authentication system
- **Session Management**: Persistent login sessions with local storage
- **Password Validation**: Real-time password strength checking
- **User Profiles**: Basic user profile management

### 🎯 Daily Challenges
- **30+ Unique Challenges**: Diverse wellness tasks across multiple categories
- **Daily Rotation**: New challenge every day based on date algorithm
- **Categories**: 
  - 💧 **Wellness**: Hydration, nutrition, self-care
  - 🧘 **Physical**: Exercise, stretching, movement
  - 🧠 **Mental**: Mindfulness, gratitude, creativity
  - 👥 **Social**: Connection, communication, kindness
  - 📋 **Productivity**: Organization, planning, digital wellness

### 📊 Progress Tracking
- **Streak Counter**: Track consecutive days of completed challenges
- **Completion Stats**: Total challenges completed over time
- **Weekly Calendar**: Visual progress indicator for the current week
- **Challenge History**: View past challenges and completion status
- **Skip Option**: Ability to skip challenges (resets streak)

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Intuitive Navigation**: Easy switching between dashboard and progress views
- **Visual Feedback**: Clear indicators for completed, skipped, and pending challenges

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser!

### Installation
1. **Clone or Download** the repository
2. **Open `index.html`** in your web browser
3. **Sign up** for a new account or **login** if you already have one
4. **Start your daily challenge journey!**

### Usage
1. **Create Account**: Sign up with your name, email, and password
2. **Daily Challenge**: Visit the site each day to see your new challenge
3. **Complete Tasks**: Mark challenges as complete when finished
4. **Track Progress**: View your streak and completion history
5. **Build Habits**: Consistency is key - try to complete challenges daily!

## 🏗️ Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript
- **Local Storage**: Client-side data persistence

### Key Components

#### 🎯 Challenge System (`js/challenges.js`)
- **ChallengeManager**: Loads and manages the challenge database
- **Daily Algorithm**: Deterministic challenge selection based on date
- **Category Filtering**: Organize challenges by type and difficulty
- **Search Functionality**: Find specific challenges by keywords

#### 🔐 Authentication (`js/auth.js`)
- **AuthManager**: Complete user management system
- **Password Security**: Basic hashing and validation
- **Session Handling**: Persistent login state
- **Profile Management**: User data updates and account management

#### 📈 Progress Tracking (`js/challenges.js`)
- **ProgressTracker**: Comprehensive progress monitoring
- **Streak Calculation**: Smart streak counting with date validation
- **Data Persistence**: Local storage for user progress
- **Statistics**: Various metrics and historical data

#### 🎮 Main Application (`js/app.js`)
- **MicroChallengeApp**: Central application controller
- **UI Management**: Dynamic view switching and updates
- **Event Handling**: User interaction management
- **State Management**: Application state coordination

### 📁 Project Structure
```
micro-challenge-website/
├── index.html              # Main application page
├── css/
│   ├── styles.css          # Main styling and layout
│   └── auth.css           # Authentication form styles
├── js/
│   ├── app.js             # Main application controller
│   ├── auth.js            # Authentication system
│   └── challenges.js      # Challenge and progress management
├── data/
│   └── challenges.json    # Challenge database (30+ challenges)
└── README.md              # This file
```

## 🎨 Design Philosophy

### Wellness-First Approach
- **Micro-Habits**: Small, achievable tasks that build momentum
- **Positive Reinforcement**: Encouraging messages and visual feedback
- **Flexibility**: Skip option prevents guilt and maintains engagement
- **Variety**: Different challenge types prevent monotony

### User Experience Principles
- **Simplicity**: Clean, uncluttered interface
- **Accessibility**: High contrast, readable fonts, responsive design
- **Performance**: Fast loading, no external dependencies
- **Privacy**: All data stored locally, no server tracking

## 🔮 Future Enhancements

### Potential Features
- **Custom Challenges**: Allow users to create their own challenges
- **Social Features**: Share progress with friends and family
- **Achievement Badges**: Unlock rewards for milestones
- **Challenge Categories**: Filter by preferred challenge types
- **Difficulty Levels**: Adaptive challenge difficulty
- **Reminder System**: Browser notifications for daily challenges
- **Data Export**: Download progress data
- **Dark Mode**: Alternative color scheme
- **Offline Support**: Progressive Web App capabilities

### Technical Improvements
- **Backend Integration**: User accounts with cloud sync
- **Database**: Proper database instead of JSON file
- **Security**: Enhanced authentication and password security
- **Analytics**: Usage statistics and insights
- **Testing**: Automated testing suite
- **Performance**: Code optimization and caching

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! If you have ideas for new challenges or features, please feel free to reach out.

### Challenge Ideas
We're always looking for new micro-challenge ideas! Good challenges should be:
- **Quick**: Completable in 1-5 minutes
- **Accessible**: Doable by most people in most situations
- **Positive**: Focused on wellness and self-improvement
- **Specific**: Clear, actionable instructions

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Inspiration**: The concept of micro-habits and atomic habits
- **Design**: Modern web design principles and wellness app aesthetics
- **Community**: The wellness and self-improvement community for challenge ideas

---

**Start your journey today! Small steps lead to big changes.** 🌟

*Built with ❤️ for better daily habits*

