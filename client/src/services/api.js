import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { getIdToken } = useAuth();
  const API_URL = "http://localhost:8080/api";

  // Generic fetch function with authentication
  const fetchWithAuth = async (endpoint, options = {}) => {
    const token = await getIdToken();
    
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    const response = await fetch(`${API_URL}/${endpoint}`, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }
    
    return response.json();
  };

  // API methods
  return {
    // User profile
    getUserProfile: () => fetchWithAuth("users/profile"),
    updateUserProfile: (data) => fetchWithAuth("users/profile", { 
      method: "PATCH", 
      body: JSON.stringify(data)
    }),
    
    // Other API methods as needed
    // ...
  };
}