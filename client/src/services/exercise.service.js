import axios from 'axios';

class ExerciseService {
  constructor() {
    this.baseUrl = 'https://exercisedb-api.vercel.app/api/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    });
  }

  // Generic fetch method with error handling
  async fetchData(endpoint) {
    try {
      const response = await this.axiosInstance.get(endpoint);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Fetch all exercises
  getExercises() {
    return this.fetchData('/exercises');
  }

  // Fetch exercise by ID
  getExerciseById(id) {
    return this.fetchData(`/exercises/${id}`);
  }

  // Fetch all body parts
  getBodyParts() {
    return this.fetchData('/bodyparts');
  }

  // Fetch all equipment
  getEquipment() {
    return this.fetchData('/equipments');
  }

  // Fetch all target muscles
  getMuscles() {
    return this.fetchData('/muscles');
  }
}

export default new ExerciseService();