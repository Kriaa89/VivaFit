import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/home/Home';
import AboutUs from './components/home/AboutUs';

// Exercise Components
import ExerciseList from './components/exercise/ExerciseList';
import ExerciseDetail from './components/exercise/ExerciseDetail';
import WorkoutGenerator from './components/exercise/WorkoutGenerator';
import MuscleGroupPlanner from './components/exercise/MuscleGroupPlanner';
import HomeGymSelector from './components/exercise/HomeGymSelector';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Onboarding */}
          <Route path="/onboarding"
            element={
              <ProtectedRoute requireOnboarding="check">
                <OnboardingForm />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Dashboard */}
          <Route path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Exercise Features */}
          <Route path="/exercises"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExerciseList />
              </ProtectedRoute>
            }
          />
          <Route path="/exercises/:id"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExerciseDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/workout-generator"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <WorkoutGenerator />
              </ProtectedRoute>
            }
          />
          <Route path="/muscle-group-planner"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <MuscleGroupPlanner />
              </ProtectedRoute>
            }
          />
          <Route path="/home-gym-selector"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <HomeGymSelector />
              </ProtectedRoute>
            }
          />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
