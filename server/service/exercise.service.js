import axios from 'axios';

class ExerciseService {
  constructor() {
    this.baseUrl = 'https://exercisedb-api.vercel.app/api/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    });
  }

  async getExercises() {
    try {
      const response = await this.axiosInstance.get('/exercises');
      if (!response.data) {
        throw new Error('No data received from ExerciseDB API');
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises from external API');
    }
  }

  async getExerciseById(id) {
    try {
      const response = await this.axiosInstance.get(`/exercises/${id}`);
      if (!response.data) {
        throw new Error(`Exercise with ID ${id} not found`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch exercise details from external API');
    }
  }

  async getBodyParts() {
    try {
      const response = await this.axiosInstance.get('/bodyParts');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching body parts:', error);
      throw new Error('Failed to fetch body parts from external API');
    }
  }

  async getEquipment() {
    try {
      const response = await this.axiosInstance.get('/equipment');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new Error('Failed to fetch equipment from external API');
    }
  }

  async getMuscles() {
    try {
      const response = await this.axiosInstance.get('/targetMuscles');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching muscles:', error);
      throw new Error('Failed to fetch target muscles from external API');
    }
  }
}

export default new ExerciseService();