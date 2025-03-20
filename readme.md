# 🏋️‍♂️ VivaFit - Personalized Fitness Journey Application

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📝 Project Overview
VivaFit is a modern fitness application designed to empower users of all fitness levels to create and manage their personalized workout programs. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and leveraging Firebase Authentication, it provides a seamless experience for fitness enthusiasts to track their progress, explore exercises, and build customized workout routines that adapt to their unique needs and goals.

Our mission is to make fitness accessible, engaging, and effective for everyone, regardless of their starting point or ultimate fitness aspirations.

## ⭐ Core Features

### 🔐 1. User Authentication & Profile Management
- Secure email/password registration and login using Firebase Authentication
- JWT-based API authentication for backend requests
- Comprehensive user profiles with:
  - 👤 Personal details (name, email, age)
  - 📏 Body metrics (height, weight with unit preferences)
  - 🎯 Fitness preferences (experience level, goals)
  - 📸 Profile photo upload capability
  - 📋 Detailed fitness preferences and dietary restrictions
  - 🕒 Preferred workout times

### 💪 2. Exercise Library
- Browse extensive exercise database with over 1,000 exercises
- Advanced filtering system by:
  - 🎯 Target muscles (biceps, triceps, back, chest, shoulders, etc.)
  - 🏋️ Equipment requirements (dumbbells, machines, bodyweight, etc.)
  - 🦾 Body parts (arms, legs, core, full body, etc.)
- Detailed exercise information:
  - 🎥 Animated GIF demonstrations for proper form
  - 📖 Step-by-step instructions for each exercise
  - ⚡ Required equipment specifications
  - 🎯 Target muscles and body parts affected
  - ⚠️ Safety considerations and modification options

### 📅 3. Workout Program Builder
- Create customized weekly workout programs tailored to your schedule
- Comprehensive features include:
  - 📆 Day-by-day exercise planning for structured routines
  - 🎯 Exercise selection from our extensive database
  - ⏱️ Custom set/rep/rest time configuration for each exercise
  - 📝 Program naming and organization for easy reference
  - 📊 Balanced workout distribution across muscle groups
- 💾 Save and manage multiple programs for different goals
- 📊 View saved programs with detailed breakdowns of exercises per day

### 📈 4. Dashboard & Progress Tracking
- Personalized dashboard with overview of fitness profile
- BMI calculation and category indication with health insights
- Track weight changes and body metrics over time
- Visual indicators of progress and achievements
- Responsive design that works seamlessly on mobile and desktop

## 🛠️ Technical Stack

### 🎨 Frontend
- ⚛️ React with Vite for a lightning-fast development experience
- 🎭 Tailwind CSS for responsive, utility-first styling
- 🛣️ React Router for seamless navigation and protected routes
- 🔥 Firebase Authentication for secure user management
- 🌐 Axios for efficient API requests and data handling
- 📱 Responsive design principles for all device sizes

### ⚙️ Backend
- 🟢 Node.js with Express for efficient API development
- 🍃 MongoDB with Mongoose for flexible data modeling
- 🔑 JWT for secure API authentication and authorization
- 🔥 Firebase Admin SDK for user verification
- 🔄 RESTful API architecture for predictable endpoints
- 📂 Cloud storage integration for profile pictures

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v16.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Firebase account and project configuration
- ExerciseDB API access key

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
- Client .env variables:
  ```
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_firebase_app_id
  VITE_API_BASE_URL=http://localhost:8000/api
  ```
- Server .env variables:
  ```
  PORT=8000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  FIREBASE_PROJECT_ID=your_firebase_project_id
  EXERCISE_DB_API_KEY=your_exercisedb_api_key
  ```

4. Start the development servers:
```bash
# Frontend
cd client
npm run dev

# Backend
cd ../server
npm run dev
```

5. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 💡 Project Structure

```
VivaFit/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── assets/          # Images and static resources
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── firebase/        # Firebase configuration
│   │   └── utils/           # Utility functions
├── server/                  # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   └── uploads/             # User uploaded files
```

## 🔮 Future Enhancements
- 📊 Interactive progress charts and detailed statistics
- 🤝 Social features for workout sharing and community building
- 🥗 Nutrition tracking and meal planning integration
- 📱 Native mobile app development for iOS and Android
- 🤖 AI-powered workout recommendations based on user progress
- 🔔 Push notifications and workout reminders

## 👥 Contributors
- 👨‍💻 [Abdallah Yessine Kriaa](https://github.com/Kriaa89) - Full Stack Developer
- 👨‍💻 [Hamza Jbali](https://github.com/hamzajbali) - UX Designer & Developer

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
Made with ❤️ by the VivaFit Team | © 2023 VivaFit
</div>