import axios from 'axios';

class ExerciseService {
  async getExercises() {
    try {
      const response = await axios.get('https://exercisedb-api.vercel.app/api/v1/exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  async getExerciseById(id) {
    try {
      const response = await axios.get(`https://exercisedb-api.vercel.app/api/v1/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      return null;
    }
  }
}

export default new ExerciseService();