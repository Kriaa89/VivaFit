import React, { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import exerciseService from '../../services/exercise.service';

// Body types don't come from the API, so we'll keep these as static options
const bodyTypes = ['Ectomorph', 'Mesomorph', 'Endomorph'];
const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
const fitnessGoals = ['weight loss', 'muscle gain', 'endurance', 'strength', 'flexibility', 'overall fitness'];

const WorkoutRecommendationForm = ({ onRecommendationsReceived }) => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for form data
  const [formData, setFormData] = useState({
    bodyType: 'Mesomorph',
    equipment: 'body weight',
    goal: 'overall fitness',
    fitnessLevel: 'beginner'
  });
  
  // State for API data
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Fetch equipment options from API on component mount
  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoadingOptions(true);
      try {
        const equipment = await exerciseService.getEquipment();
        if (equipment && equipment.length > 0) {
          setEquipmentOptions(equipment);
          
          // Set default equipment to the first option
          if (equipment.length > 0 && equipment[0].name) {
            setFormData(prev => ({...prev, equipment: equipment[0].name}));
          }
        } else {
          // Fallback to basic options if API fails
          setEquipmentOptions([
            { name: 'body weight' },
            { name: 'dumbbell' },
            { name: 'barbell' },
            { name: 'cable' },
            { name: 'machine' },
            { name: 'kettlebell' }
          ]);
        }
      } catch (error) {
        console.error('Error loading equipment options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.getRecommendations(formData);
      
      if (response.success && response.data) {
        onRecommendationsReceived(response.data);
      } else {
        setError('Failed to get recommendations. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching recommendations.');
      console.error('Recommendation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Personalized Workout Recommendations</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoadingOptions ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
              Body Type
            </label>
            <select
              id="bodyType"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {bodyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
              Available Equipment
            </label>
            <select
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {equipmentOptions.map(eq => (
                <option key={eq.name} value={eq.name}>{eq.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              Fitness Goal
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {fitnessGoals.map(goal => (
                <option key={goal} value={goal}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Fitness Level
            </label>
            <select
              id="fitnessLevel"
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {fitnessLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Generating Recommendations...' : 'Get Workout Plan'}
          </button>
        </form>
      )}
    </div>
  );
};

export default WorkoutRecommendationForm;