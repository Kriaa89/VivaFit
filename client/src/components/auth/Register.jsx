import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AppNavbar from "../home/AppNavbar";
import Footer from "../home/Footer";

/**
 * Register component for user signup with email/password
 */
function Register() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Auth context and navigation
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * Handle email/password registration
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      
      // Register with Firebase
      const user = await register(email, password, firstName, lastName);
      
      // Wait briefly for Firebase auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get auth token
      const token = await user.getIdToken(true);
      
      if (!token) {
        throw new Error("Failed to get authentication token");
      }
      
      // Create user profile in database
      await createUserProfile(firstName, lastName, email, token);
      
      // Navigate to onboarding
      navigate("/onboarding");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use. Please use a different email or try logging in instead.");
      } else {
        setError(err.message || "Failed to create an account");
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Create user profile in backend database
   */
  async function createUserProfile(firstName, lastName, email, token) {
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, email })
      });
      
      const data = await response.json();
      
      // Continue if user already exists
      if (!response.ok) {
        if (data.message && data.message.toLowerCase().includes("user already exists")) {
          return data;
        }
        throw new Error(`Failed to create user profile: ${data.message || response.statusText}`);
      }
      
      return data;
    } catch (error) {
      // Don't throw error - allows user to continue even if MongoDB registration fails
      console.error("Profile creation error:", error);
      return { success: false, error: error.message };
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />

      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-2xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Last Name
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="username"
              />
            </div>
            
            {/* Password fields */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="new-password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="new-password"
              />
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md ${loading && 'opacity-70 cursor-not-allowed'}`}
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
          
          {/* Login link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;