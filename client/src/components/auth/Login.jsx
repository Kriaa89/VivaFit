import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AppNavbar from "../home/AppNavbar";
import Footer from "../home/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      
      // Check if user has completed onboarding
      const token = await getIdToken();
      const response = await fetch("http://localhost:8000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        // If user has completed onboarding (has profile data), go to dashboard
        if (profile.age && profile.weight && profile.height) {
          navigate("/dashboard");
        } else {
          // If not completed onboarding, redirect to onboarding
          navigate("/onboarding");
        }
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      setError("Failed to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      
      const { user, firstName, lastName, email } = await signInWithGoogle();
      const token = await user.getIdToken(true);
      
      if (!token) {
        throw new Error("Failed to get authentication token from Google sign-in");
      }
      
      await createUserProfileFromGoogle(firstName, lastName, email, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  }

  async function createUserProfileFromGoogle(firstName, lastName, email, token) {
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.message && data.message.toLowerCase().includes("user already exists")) {
          return data;
        }
        throw new Error(`Failed to create user profile: ${data.message || response.statusText}`);
      }
      
      return data;
    } catch (error) {
      // Don't throw the error - this allows the user to continue even if MongoDB registration fails
      return { success: false, error: error.message };
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-md mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Log In</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md ${loading && 'opacity-70 cursor-not-allowed'}`}
            >
              Log In
            </button>
          </form>
          
          {/* Google Sign-In */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`mt-4 w-full flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${loading && 'opacity-70 cursor-not-allowed'}`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Need an account?{" "}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;