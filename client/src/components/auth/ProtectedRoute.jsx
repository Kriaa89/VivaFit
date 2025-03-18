import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getIdToken } from '../../utils/auth';

const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const token = await getIdToken();
        const response = await fetch("http://localhost:8000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const profile = await response.json();
          const isOnboardingComplete = profile && profile.age && profile.weight && profile.height;
          setHasCompletedOnboarding(isOnboardingComplete);

          // If we're on the onboarding page and user is already onboarded
          if (requireOnboarding === "check" && isOnboardingComplete) {
            window.location.href = "/dashboard";
            return;
          }
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasCompletedOnboarding(false);
      }
      setLoading(false);
    }

    checkOnboarding();
  }, [currentUser, requireOnboarding]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // For regular protected routes that require onboarding
  if (requireOnboarding === true && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;