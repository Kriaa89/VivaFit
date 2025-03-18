import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import exerciseService from '../../services/exercise.service';

const HomeGymSelector = () => {
  // States for exercise data
  const [exercises, setExercises] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  
  // States for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for filters
  const [location, setLocation] = useState('home'); // 'home' or 'gym'
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Preset equipment for different workout locations
  const homeEquipment = ['body weight', 'dumbbell', 'band', 'kettlebell', 'resistance band', 'stability ball', 'medicine ball'];
  const gymEquipment = ['barbell', 'cable', 'leverage machine', 'smith machine', 'hammer', 'assisted', 'bosu ball', 'wheel roller', 'upper body ergometer', 'weighted'];
  
  // Fetch exercise data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch exercises and equipment data
        const [exercisesData, equipmentData] = await Promise.all([
          exerciseService.getExercises(),
          exerciseService.getEquipment()
        ]);
        
        setExercises(exercisesData);
        setEquipment(equipmentData);
        
        // Initially set available equipment based on default location (home)
        setAvailableEquipment(homeEquipment);
        
        // Initially filter exercises for home equipment
        const homeExercises = exercisesData.filter(exercise => 
          homeEquipment.includes(exercise.equipment) || exercise.equipment === 'body weight'
        );
        setFilteredExercises(homeExercises);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching exercise data:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Toggle selected body parts
  const toggleBodyPart = (bodyPart) => {
    setSelectedBodyParts(prev => 
      prev.includes(bodyPart) 
        ? prev.filter(p => p !== bodyPart) 
        : [...prev, bodyPart]
    );
  };

  // Change workout location
  const changeLocation = (newLocation) => {
    setLocation(newLocation);
    
    if (newLocation === 'home') {
      setAvailableEquipment(homeEquipment);
    } else {
      setAvailableEquipment([...homeEquipment, ...gymEquipment]);
    }
  };

  // Filter exercises based on selected location, equipment, and body parts
  useEffect(() => {
    if (!exercises.length) return;
    
    let filtered = exercises;
    
    // Filter by available equipment
    filtered = filtered.filter(exercise => 
      availableEquipment.includes(exercise.equipment) || exercise.equipment === 'body weight'
    );
    
    // Filter by selected body parts
    if (selectedBodyParts.length > 0) {
      filtered = filtered.filter(exercise => 
        selectedBodyParts.includes(exercise.bodyPart)
      );
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => {
        // This is a simplified difficulty assessment based on equipment type
        // A more sophisticated approach would use a difficulty rating from the API if available
        if (selectedDifficulty === 'beginner') {
          return ['body weight', 'dumbbell', 'band', 'resistance band'].includes(exercise.equipment);
        } else if (selectedDifficulty === 'intermediate') {
          return ['kettlebell', 'cable', 'medicine ball', 'stability ball'].includes(exercise.equipment);
        } else if (selectedDifficulty === 'advanced') {
          return ['barbell', 'leverage machine', 'smith machine', 'hammer', 'weighted'].includes(exercise.equipment);
        }
        return true;
      });
    }
    
    setFilteredExercises(filtered);
  }, [exercises, availableEquipment, selectedBodyParts, selectedDifficulty]);

  // Group exercises by body part for better organization
  const exercisesByBodyPart = filteredExercises.reduce((acc, exercise) => {
    if (!acc[exercise.bodyPart]) {
      acc[exercise.bodyPart] = [];
    }
    acc[exercise.bodyPart].push(exercise);
    return acc;
  }, {});

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Get all unique body parts from exercises
  const bodyParts = [...new Set(exercises.map(exercise => exercise.bodyPart))];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Home & Gym Workout Selector</h2>
      
      {/* Location Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Choose Your Workout Environment</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className={`flex-1 cursor-pointer rounded-lg p-6 border-2 transition-colors ${
            location === 'home' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
          }`} onClick={() => changeLocation('home')}>
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900">Home Workout</h4>
            </div>
            <p className="text-gray-600">Limited equipment options but perfect for working out from the comfort of home.</p>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Available Equipment:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {homeEquipment.slice(0, 3).map((item) => (
                  <span key={item} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
                {homeEquipment.length > 3 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    +{homeEquipment.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className={`flex-1 cursor-pointer rounded-lg p-6 border-2 transition-colors ${
            location === 'gym' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
          }`} onClick={() => changeLocation('gym')}>
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900">Gym Workout</h4>
            </div>
            <p className="text-gray-600">Full range of equipment options for more varied and intensive workouts.</p>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Available Equipment:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {gymEquipment.slice(0, 3).map((item) => (
                  <span key={item} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
                {gymEquipment.length > 3 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    +{gymEquipment.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Body Part Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Body Parts</label>
            <div className="h-40 overflow-y-auto border border-gray-300 rounded p-2">
              {bodyParts.map((bodyPart) => (
                <div key={bodyPart} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`bodyPart-${bodyPart}`}
                    checked={selectedBodyParts.includes(bodyPart)}
                    onChange={() => toggleBodyPart(bodyPart)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor={`bodyPart-${bodyPart}`} className="ml-2 text-sm text-gray-700">
                    {bodyPart}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="difficulty-all"
                  name="difficulty"
                  value="all"
                  checked={selectedDifficulty === 'all'}
                  onChange={() => setSelectedDifficulty('all')}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="difficulty-all" className="ml-2 text-sm text-gray-700">
                  All Levels
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="difficulty-beginner"
                  name="difficulty"
                  value="beginner"
                  checked={selectedDifficulty === 'beginner'}
                  onChange={() => setSelectedDifficulty('beginner')}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="difficulty-beginner" className="ml-2 text-sm text-gray-700">
                  Beginner
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="difficulty-intermediate"
                  name="difficulty"
                  value="intermediate"
                  checked={selectedDifficulty === 'intermediate'}
                  onChange={() => setSelectedDifficulty('intermediate')}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="difficulty-intermediate" className="ml-2 text-sm text-gray-700">
                  Intermediate
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="difficulty-advanced"
                  name="difficulty"
                  value="advanced"
                  checked={selectedDifficulty === 'advanced'}
                  onChange={() => setSelectedDifficulty('advanced')}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="difficulty-advanced" className="ml-2 text-sm text-gray-700">
                  Advanced
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredExercises.length} exercises found
            </span>
            <span className="text-sm font-medium text-gray-600">
              {location === 'home' ? 'Home Workout' : 'Gym Workout'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Exercise Results */}
      {Object.keys(exercisesByBodyPart).length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">No exercises found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(exercisesByBodyPart).map(([bodyPart, exercises]) => (
            <div key={bodyPart} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-gray-800 capitalize">{bodyPart} Exercises</h3>
                <p className="text-sm text-gray-600">{exercises.length} exercises available</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises.map((exercise) => (
                    <Link 
                      key={exercise.id}
                      to={`/exercises/${exercise.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                          <img 
                            src={exercise.gifUrl} 
                            alt={exercise.name} 
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-900">{exercise.name}</h4>
                          <div className="flex items-center mt-1">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                              {exercise.target}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {exercise.equipment}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeGymSelector;