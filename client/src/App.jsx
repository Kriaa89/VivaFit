import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Redirect root to login or dashboard */}
            <Route 
            path="/" 
            element={<Navigate to="/login" />} 
          />
          { /* catch all - redirect to login */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
