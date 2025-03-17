import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { getIdToken } = useAuth();
  const API_URL = "http://localhost:8000/api";

  // Simple helper for API calls
  const makeRequest = async (method, endpoint, data = null) => {
    try {
      const token = await getIdToken();
      const config = {
        method,
        url: `${API_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        ...(data && { data })
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "API request failed");
    }
  };

  return {
    getUserProfile: () => makeRequest('get', '/users/profile'),
    updateUserProfile: (data) => makeRequest('patch', '/users/profile', data)
  };
}