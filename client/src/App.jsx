import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OnboardingForm from './components/OnboardingForm';
import Home from './components/home/Home';
import AboutUs from './components/home/AboutUs';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import ExercisesList from './components/exercise/ExercisesList';
import WorkoutPlayer from './components/exercise/WorkoutPlayer';
import WorkoutTracker from './components/workout/WorkoutTracker';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exercises" element={<ExercisesList />} />
            
            {/* Protected Routes */}
            <Route path="/onboarding"
              element={
                <ProtectedRoute requireOnboarding="check">
                  <OnboardingForm />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard"
              element={
                <ProtectedRoute requireOnboarding={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/profile"
              element={
                <ProtectedRoute requireOnboarding={true}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/workout/:programId"
              element={
                <ProtectedRoute requireOnboarding={true}>
                  <WorkoutPlayer />
                </ProtectedRoute>
              }
            />
            <Route path="/track-workout"
              element={
                <ProtectedRoute requireOnboarding={true}>
                  <WorkoutTracker />
                </ProtectedRoute>
              }
            />
            {/* Redirect root to home */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
