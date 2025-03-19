import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getIdToken } from '../../utils/auth';

/**
 * ProtectedRoute component that handles authentication and onboarding status verification
 * @param {object} props Component props
 * @param {React.ReactNode} props.children Child components to render when authenticated
 * @param {boolean|string} props.requireOnboarding Controls onboarding flow:
 *   - true: User must have completed onboarding or will be redirected to onboarding
 *   - "check": Check if onboarding is completed, redirect to dashboard if already done
 *   - false: No onboarding check required
 */
const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      // If no user is logged in, set loading to false and let the component handle redirection
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Only check onboarding status if required
      if (requireOnboarding) {
        try {
          const token = await getIdToken();
          const response = await fetch("http://localhost:8000/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const profile = await response.json();
            // Check if essential profile fields exist
            const isOnboardingComplete = profile && profile.data && 
              profile.data.age && profile.data.weight && profile.data.height;
            setHasCompletedOnboarding(isOnboardingComplete);

            // Special case: If we're on the onboarding page but user is already onboarded
            if (requireOnboarding === "check" && isOnboardingComplete) {
              navigate("/dashboard");
              return;
            }
          } else {
            setHasCompletedOnboarding(false);
          }
        } catch (error) {
          setHasCompletedOnboarding(false);
        }
      }
      
      setLoading(false);
    }

    checkOnboarding();
  }, [currentUser, requireOnboarding, navigate]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect to onboarding if required but not completed
  if (requireOnboarding === true && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  // User is authenticated and has passed onboarding requirements
  return children;
};

export default ProtectedRoute;