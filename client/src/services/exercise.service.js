import axios from 'axios';

/**
 * ExerciseDB API Service
 * 
 * Provides methods to interact with the ExerciseDB API and fetch exercise data
 */
class ExerciseService {
  constructor() {
    this.baseUrl = 'https://exercisedb-api.vercel.app/api/v1';
    this.cache = {
      bodyParts: null,
      exercises: null,
      equipment: null,
      muscles: null,
    };
  }

  /**
   * Clear the cache for refreshed data
   */
  clearCache() {
    this.cache = {
      bodyParts: null,
      exercises: null,
      equipment: null,
      muscles: null,
    };
  }

  /**
   * Get all available body parts
   * @returns {Promise<Array>} List of body parts
   */
  async getBodyParts() {
    if (this.cache.bodyParts) return this.cache.bodyParts;

    try {
      const response = await axios.get(`${this.baseUrl}/bodyparts`);
      this.cache.bodyParts = response.data.data || [];
      return this.cache.bodyParts;
    } catch (error) {
      console.error('Error fetching body parts:', error);
      return [];
    }
  }

  /**
   * Get all available equipment types
   * @returns {Promise<Array>} List of equipment
   */
  async getEquipment() {
    if (this.cache.equipment) return this.cache.equipment;

    try {
      const response = await axios.get(`${this.baseUrl}/equipments`);
      this.cache.equipment = response.data.data || [];
      return this.cache.equipment;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  }

  /**
   * Get all available muscle targets
   * @returns {Promise<Array>} List of muscles
   */
  async getMuscles() {
    if (this.cache.muscles) return this.cache.muscles;

    try {
      const response = await axios.get(`${this.baseUrl}/muscles`);
      this.cache.muscles = response.data.data || [];
      return this.cache.muscles;
    } catch (error) {
      console.error('Error fetching muscles:', error);
      return [];
    }
  }

  /**
   * Get all exercises or filtered exercises
   * @param {Object} params - Optional filter parameters
   * @param {Number} params.limit - Maximum number of results
   * @param {Number} params.offset - Pagination offset
   * @param {String} params.bodyPart - Filter by body part
   * @param {String} params.equipment - Filter by equipment
   * @param {String} params.target - Filter by target muscle
   * @returns {Promise<Array>} List of exercises
   */
  async getExercises(params = {}) {
    // For non-filtered requests, check cache
    if (Object.keys(params).length === 0 && this.cache.exercises) {
      return this.cache.exercises;
    }

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
      const exercises = response.data.data || [];
      
      // Cache only full exercise set (no filters)
      if (Object.keys(params).length === 0) {
        this.cache.exercises = exercises;
      }
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  /**
   * Get exercises by body part
   * @param {String} bodyPart Body part name
   * @returns {Promise<Array>} List of exercises
   */
  async getExercisesByBodyPart(bodyPart) {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching exercises by body part (${bodyPart}):`, error);
      return [];
    }
  }

  /**
   * Get exercises by target muscle
   * @param {String} target Target muscle name
   * @returns {Promise<Array>} List of exercises
   */
  async getExercisesByTarget(target) {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/target/${target}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching exercises by target (${target}):`, error);
      return [];
    }
  }

  /**
   * Get exercises by equipment
   * @param {String} equipment Equipment name
   * @returns {Promise<Array>} List of exercises
   */
  async getExercisesByEquipment(equipment) {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/equipment/${equipment}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching exercises by equipment (${equipment}):`, error);
      return [];
    }
  }
}

// Export a singleton instance
const exerciseService = new ExerciseService();
export default exerciseService;