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

// Import a placeholder component for routes that are not yet implemented
const PlaceholderPage = ({ pageName }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{pageName} Page</h1>
      <p className="text-gray-600">This page is coming soon!</p>
      <div className="mt-6">
        <a href="/" className="text-green-500 hover:text-green-700">Return to Home</a>
      </div>
    </div>
  </div>
);

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
            <Route path="/onboarding" element={<OnboardingForm />} />
            
            {/* Placeholder pages for navigation links that don't have complete components yet */}
            <Route path="/services" element={<PlaceholderPage pageName="Services" />} />
            <Route path="/programs" element={<PlaceholderPage pageName="Programs" />} />
            <Route path="/pricing" element={<PlaceholderPage pageName="Pricing" />} />

            {/* Protected Routes */}
            <Route path="/dashboard"
              element={
                <ProtectedRoute>
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
