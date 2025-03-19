# 🏋️‍♂️ VivaFit - Personalized Fitness Journey Application

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📝 Project Overview
VivaFit is a modern fitness application that helps users create and manage their personalized workout programs. Built with the MERN stack and Firebase Authentication, it provides a seamless experience for fitness enthusiasts to track their progress and explore exercises.

## ⭐ Core Features

### 🔐 1. User Authentication & Profile Management
- Secure email/password registration and login using Firebase Authentication
- JWT-based API authentication for backend requests
- Comprehensive user profiles with:
  - 👤 Personal details (name, email, age)
  - 📏 Body metrics (height, weight with unit preferences)
  - 🎯 Fitness preferences (experience level, goals)
  - 📸 Profile photo upload capability
  - 📋 Detailed fitness preferences and restrictions

### 💪 2. Exercise Library
- Browse extensive exercise database
- Filter exercises by:
  - 🎯 Target muscles
  - 🏋️ Equipment requirements
  - 🦾 Body parts
- Detailed exercise information:
  - 🎥 Animated GIF demonstrations
  - 📖 Step-by-step instructions
  - ⚡ Required equipment
  - 🎯 Target muscles and body parts

### 📅 3. Workout Program Builder
- Create customized weekly workout programs
- Features include:
  - 📆 Day-by-day exercise planning
  - 🎯 Exercise selection from database
  - ⏱️ Set/rep/rest time customization
  - 📝 Program naming and organization
- 💾 Save and manage multiple programs
- 📊 View saved programs with detailed breakdowns

### 📈 4. Dashboard & Progress Tracking
- Overview of fitness profile
- BMI calculation and category indication
- Track weight and body metrics
- View workout history and progress

## 🛠️ Technical Stack

### 🎨 Frontend
- ⚛️ React (Vite)
- 🎭 Tailwind CSS for styling
- 🛣️ React Router for navigation
- 🔥 Firebase Authentication
- 🌐 Axios for API requests

### ⚙️ Backend
- 🟢 Node.js with Express
- 🍃 MongoDB with Mongoose
- 🔑 JWT for API authentication
- 🔥 Firebase Admin SDK
- 🔄 RESTful API architecture

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js
- MongoDB
- Firebase account and configuration
- ExerciseDB API access

### ⚡ Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd VivaFit
```

2. Install dependencies for both frontend and backend:
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. Set up environment variables:
- Create `.env` files in both client and server directories
- Add necessary configuration (Firebase, MongoDB URI, API keys)

4. Start the development servers:
```bash
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev
```

## 🔮 Future Enhancements
- 📊 Progress charts and statistics
- 🤝 Social features and workout sharing
- 🥗 Nutrition tracking integration
- 📱 Mobile app development

## 👥 Contributors
- 👨‍💻 Abdallah Yessine Kriaa
- 👨‍💻 Hamza Jbali

## 📄 License
This project is licensed under the MIT License.

---
<div align="center">
Made with ❤️ by the VivaFit Team
</div>