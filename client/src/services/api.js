import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { getIdToken } = useAuth();
  const API_URL = "http://localhost:8000/api";

  // Helper to build headers with JSON content type and Authorization token
  const getHeaders = async () => {
    const token = await getIdToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // GET request to retrieve user profile
  const getUserProfile = async () => {
    try {
      const headers = await getHeaders();
      const response = await axios.get(`${API_URL}/users/profile`, { headers });
      return response.data;
    } catch (error) {
      // Axios error handling
      const message = error.response?.data?.message || "API request failed";
      throw new Error(message);
    }
  };

  // PATCH request to update user profile with a JSON body
  const updateUserProfile = async (data) => {
    try {
      const headers = await getHeaders();
      const response = await axios.patch(`${API_URL}/users/profile`, data, { headers });
      return response.data;
    } catch (error) {
      // Axios error handling
      const message = error.response?.data?.message || "API request failed";
      throw new Error(message);
    }
  };

  return { getUserProfile, updateUserProfile };
}