import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Register function
  async function register(email, password, firstName, lastName) {
    try {
      setError("");
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Login function
  async function login(email, password) {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Google sign-in function
  async function signInWithGoogle() {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Extract profile information
      const { displayName, email, photoURL } = user;
      
      // Parse displayName into firstName and lastName
      let firstName = "", lastName = "";
      if (displayName) {
        const nameParts = displayName.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }
      
      return { user, firstName, lastName, email, photoURL };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
  
  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Get JWT token
  async function getIdToken() {
    if (!currentUser) return null;
    return await currentUser.getIdToken(true);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    error,
    register,
    login,
    logout,
    getIdToken, 
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}