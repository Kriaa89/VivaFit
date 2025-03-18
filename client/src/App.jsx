import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OnboardingForm from './components/OnboardingForm';
import Home from './components/home/Home';
import AboutUs from './components/home/AboutUs';

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
