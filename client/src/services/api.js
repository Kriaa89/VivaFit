import axios from "axios";
import { getIdToken } from "../utils/auth";

const BASE_URL = "http://localhost:8000/api";

async function makeRequest(method, endpoint, data = null) {
  try {
    const token = await getIdToken();
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export function useApi() {
  return {
    // User endpoints
    createUserProfile: (data) => makeRequest('post', '/users', data),
    getUserProfile: () => makeRequest('get', '/users/profile'),
    updateUserProfile: (data) => makeRequest('patch', '/users/profile', data),

    // Workout recommendations
    getRecommendations: (criteria) => makeRequest('post', '/recommendations', criteria)
  };
}