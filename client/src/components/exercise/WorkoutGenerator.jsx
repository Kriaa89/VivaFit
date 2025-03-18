import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import exerciseService from '../../services/exercise.service';

const WorkoutGenerator = () => {
  // States for data
  const [allExercises, setAllExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [generatedWorkout, setGeneratedWorkout] = useState([]);
  
  // States for form values
  const [workoutType, setWorkoutType] = useState('full-body');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [excludedBodyParts, setExcludedBodyParts] = useState([]);
  
  // States for UI
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [exercisesData, bodyPartsData, equipmentData] = await Promise.all([
          exerciseService.getExercises(),
          exerciseService.getBodyParts(),
          exerciseService.getEquipment()
        ]);
        
        setAllExercises(exercisesData);
        setBodyParts(bodyPartsData);
        setEquipment(equipmentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercise data:', err);
        setError('Failed to load exercise data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle equipment selection
  const toggleEquipment = (item) => {
    setSelectedEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  // Toggle excluded body parts
  const toggleBodyPart = (part) => {
    setExcludedBodyParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
  };

  // Determine exercise count based on workout duration and difficulty
  const getExerciseCount = () => {
    const baseCount = Math.floor(workoutDuration / 5);
    
    const difficultyMultiplier = {
      beginner: 0.7,
      intermediate: 1,
      advanced: 1.3
    };
    
    return Math.max(3, Math.round(baseCount * difficultyMultiplier[difficultyLevel]));
  };

  // Generate workout based on selected criteria
  const generateWorkout = () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Filter available exercises based on equipment and excluded body parts
      let availableExercises = [...allExercises];
      
      // Filter by available equipment if any is selected
      if (selectedEquipment.length > 0) {
        availableExercises = availableExercises.filter(ex => 
          selectedEquipment.includes(ex.equipment) || ex.equipment === 'body weight'
        );
      }
      
      // Filter out excluded body parts
      if (excludedBodyParts.length > 0) {
        availableExercises = availableExercises.filter(ex => 
          !excludedBodyParts.includes(ex.bodyPart)
        );
      }
      
      // If no exercises meet the criteria
      if (availableExercises.length === 0) {
        setError('No exercises match your criteria. Please adjust your filters and try again.');
        setGenerating(false);
        return;
      }
      
      let workout = [];
      
      // Generate workout based on type
      if (workoutType === 'full-body') {
        // Get unique body parts from available exercises
        const availableBodyParts = [...new Set(availableExercises.map(ex => ex.bodyPart))];
        
        // For each body part, select 1-2 exercises
        availableBodyParts.forEach(bodyPart => {
          const bodyPartExercises = availableExercises.filter(ex => ex.bodyPart === bodyPart);
          
          // Randomly select 1-2 exercises per body part
          const count = Math.min(bodyPartExercises.length, Math.random() > 0.5 ? 2 : 1);
          
          for (let i = 0; i < count; i++) {
            if (bodyPartExercises.length > 0) {
              const randomIndex = Math.floor(Math.random() * bodyPartExercises.length);
              workout.push(bodyPartExercises[randomIndex]);
              bodyPartExercises.splice(randomIndex, 1);
            }
          }
        });
      } else {
        // For muscle-group specific workout
        const targetCount = getExerciseCount();
        
        // Create a pool of exercises matching the selected workout type
        const targetExercises = availableExercises.filter(ex => {
          if (workoutType === 'upper-body') {
            return ['back', 'chest', 'shoulders', 'upper arms', 'lower arms'].includes(ex.bodyPart);
          }
          if (workoutType === 'lower-body') {
            return ['lower legs', 'upper legs', 'waist'].includes(ex.bodyPart);
          }
          if (workoutType === 'core') {
            return ['waist', 'cardio'].includes(ex.bodyPart);
          }
          return true; // Default case
        });
        
        // Randomly select exercises
        while (workout.length < targetCount && targetExercises.length > 0) {
          const randomIndex = Math.floor(Math.random() * targetExercises.length);
          workout.push(targetExercises[randomIndex]);
          targetExercises.splice(randomIndex, 1);
        }
      }
      
      // Sort workout by body part for better flow
      workout.sort((a, b) => a.bodyPart.localeCompare(b.bodyPart));
      
      // Calculate sets and reps based on difficulty
      workout = workout.map(exercise => {
        let sets, reps;
        
        switch (difficultyLevel) {
          case 'beginner':
            sets = 2;
            reps = 10;
            break;
          case 'intermediate':
            sets = 3;
            reps = 12;
            break;
          case 'advanced':
            sets = 4;
            reps = 15;
            break;
          default:
            sets = 3;
            reps = 10;
        }
        
        return {
          ...exercise,
          sets,
          reps
        };
      });
      
      setGeneratedWorkout(workout);
    } catch (err) {
      console.error('Error generating workout:', err);
      setError('An error occurred while generating your workout. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Workout Generator</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Customize Your Workout</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Workout Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
              </label>
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="full-body">Full Body</option>
                <option value="upper-body">Upper Body</option>
                <option value="lower-body">Lower Body</option>
                <option value="core">Core</option>
              </select>
            </div>
            
            {/* Difficulty Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            {/* Workout Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Duration (minutes)
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 min</span>
                <span>{workoutDuration} min</span>
                <span>90 min</span>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Available Equipment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Equipment
              </label>
              <div className="h-40 overflow-y-auto border border-gray-300 rounded p-2">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`equipment-${item}`}
                      checked={selectedEquipment.includes(item)}
                      onChange={() => toggleEquipment(item)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor={`equipment-${item}`} className="ml-2 text-sm text-gray-700">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Body weight exercises are always included
              </p>
            </div>
            
            {/* Body Parts to Exclude */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Parts to Exclude (if injured)
              </label>
              <div className="h-28 overflow-y-auto border border-gray-300 rounded p-2">
                {bodyParts.map((part) => (
                  <div key={part} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`bodypart-${part}`}
                      checked={excludedBodyParts.includes(part)}
                      onChange={() => toggleBodyPart(part)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor={`bodypart-${part}`} className="ml-2 text-sm text-gray-700">
                      {part}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateWorkout}
            disabled={generating}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition duration-300 ${generating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {generating ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Generating...
              </span>
            ) : (
              'Generate Workout'
            )}
          </button>
        </div>
      </div>
      
      {/* Generated Workout */}
      {generatedWorkout.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Your Custom Workout</h3>
          
          <div className="overflow-hidden bg-gray-50 rounded-lg mb-4">
            <div className="px-4 py-3 bg-gray-100 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800">
                  {workoutType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Workout
                </h4>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {generatedWorkout.length} exercises • Approximately {workoutDuration} minutes
              </p>
            </div>
            
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-2">Exercise</th>
                      <th scope="col" className="px-4 py-2">Body Part</th>
                      <th scope="col" className="px-4 py-2">Equipment</th>
                      <th scope="col" className="px-4 py-2">Sets</th>
                      <th scope="col" className="px-4 py-2">Reps</th>
                      <th scope="col" className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedWorkout.map((exercise) => (
                      <tr key={exercise.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-2">
                              <img 
                                src={exercise.gifUrl} 
                                alt={exercise.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {exercise.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">{exercise.bodyPart}</td>
                        <td className="px-4 py-3">{exercise.equipment}</td>
                        <td className="px-4 py-3">{exercise.sets}</td>
                        <td className="px-4 py-3">{exercise.reps}</td>
                        <td className="px-4 py-3 text-right">
                          <Link 
                            to={`/exercises/${exercise.id}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={generateWorkout}
                  className="bg-white border border-green-500 text-green-500 hover:bg-green-50 font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Regenerate Workout
                </button>
                
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;