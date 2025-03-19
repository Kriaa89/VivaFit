# VivaFit - Personalized Fitness Journey Application

## Project Overview
VivaFit is a modern fitness application that helps users create and manage their personalized workout programs. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and Firebase Authentication, it provides a seamless experience for fitness enthusiasts to track their progress and explore exercises.

## Core Features

### 1. User Authentication & Profile Management
- Secure email/password registration and login using Firebase Authentication
- JWT-based API authentication for backend requests
- Comprehensive user profiles with:
  - Personal details (name, email, age)
  - Body metrics (height, weight with unit preferences)
  - Fitness preferences (experience level, goals)
  - Profile photo upload capability
  - Detailed fitness preferences and restrictions

### 2. Exercise Library
- Browse extensive exercise database
- Filter exercises by:
  - Target muscles
  - Equipment requirements
  - Body parts
- Detailed exercise information:
  - Animated GIF demonstrations
  - Step-by-step instructions
  - Required equipment
  - Target muscles and body parts

### 3. Workout Program Builder
- Create customized weekly workout programs
- Features include:
  - Day-by-day exercise planning
  - Exercise selection from database
  - Set/rep/rest time customization
  - Program naming and organization
- Save and manage multiple programs
- View saved programs with detailed breakdowns

### 4. Dashboard & Progress Tracking
- Overview of fitness profile
- BMI calculation and category indication
- Track weight and body metrics
- View workout history and progress

## Technical Stack

### Frontend
- React (Vite)
- Tailwind CSS for styling
- React Router for navigation
- Firebase Authentication
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for API authentication
- Firebase Admin SDK
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Firebase account and configuration
- ExerciseDB API access

### Installation
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

## Future Enhancements
- Progress charts and statistics
- Social features and workout sharing
- Nutrition tracking integration
- Mobile app development

## Contributors
- Abdallah Yessine Kriaa
- Hamza Jbali

## License
This project is licensed under the MIT License.