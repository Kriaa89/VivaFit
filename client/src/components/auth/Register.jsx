import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AppNavbar from "../home/AppNavbar";
import Footer from "../home/Footer";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, getIdToken, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      
      // Register the user
      const user = await register(email, password, firstName, lastName);
      
      // Get token using the function from the component level
      const token = await getIdToken();
      
      // Create user profile in database
      await createUserProfile(firstName, lastName, email, token);
      
      navigate("/dashboard");
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

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      
      const { user, firstName, lastName, email } = await signInWithGoogle();
      
      // Create user profile in your database
      const token = await user.getIdToken();
      await createUserProfile(firstName, lastName, email, token);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  }

  // Function to create user profile in your database
  async function createUserProfile(firstName, lastName, email, token) {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
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
      
      // If response fails, check if it is due to an existing user.
      if (!response.ok) {
        const data = await response.json();
        if (data.message && data.message.toLowerCase().includes("user already exists")) {
          // Proceed without error if the user already exists.
          return data;
        }
        throw new Error("Failed to create user profile");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-2xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Last Name
                </label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            
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
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md ${loading && 'opacity-70 cursor-not-allowed'}`}
            >
              Sign Up
            </button>
          </form>
          
          {/* Google Sign-Up */}
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
              Sign up with Google
            </button>
          </div>
          
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Register;