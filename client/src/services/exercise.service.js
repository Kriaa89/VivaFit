import axios from 'axios';

class ExerciseService {
  constructor() {
    this.baseUrl = 'https://exercisedb-api.vercel.app/api/v1';
  }

  async getExercises(params = {}) {
    try {
      // Build URL with query parameters
      let url = `${this.baseUrl}/exercises`;
      
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      
      // Add query string to URL if there are parameters
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  async getBodyParts() {
    try {
      const response = await axios.get(`${this.baseUrl}/bodyparts`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching body parts:', error);
      return [];
    }
  }

  async getEquipment() {
    try {
      const response = await axios.get(`${this.baseUrl}/equipments`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  }

  async getMuscles() {
    try {
      const response = await axios.get(`${this.baseUrl}/muscles`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching muscles:', error);
      return [];
    }
  }
}

const exerciseService = new ExerciseService();
export default exerciseService;