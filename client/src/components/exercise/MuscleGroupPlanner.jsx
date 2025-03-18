import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import exerciseService from '../../services/exercise.service';

const MuscleGroupPlanner = () => {
  const [muscles, setMuscles] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  
  // Selected filters
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  
  // Fetch all exercise data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [exercisesData, musclesData, bodyPartsData, equipmentData] = await Promise.all([
          exerciseService.getExercises(),
          exerciseService.getMuscles(),
          exerciseService.getBodyParts(),
          exerciseService.getEquipment()
        ]);
        
        setExercises(exercisesData);
        setMuscles(musclesData);
        setBodyParts(bodyPartsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load exercise data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter exercises when selected muscle or body part changes
  useEffect(() => {
    if (!exercises.length) return;
    
    let filtered = [...exercises];
    
    // Filter by target muscle
    if (selectedMuscle) {
      filtered = filtered.filter(exercise => 
        exercise.target.toLowerCase() === selectedMuscle.toLowerCase()
      );
    }
    
    // Filter by body part
    if (selectedBodyPart) {
      filtered = filtered.filter(exercise => 
        exercise.bodyPart.toLowerCase() === selectedBodyPart.toLowerCase()
      );
    }
    
    // Filter by equipment
    if (selectedEquipment) {
      filtered = filtered.filter(exercise => 
        exercise.equipment.toLowerCase() === selectedEquipment.toLowerCase()
      );
    }
    
    setFilteredExercises(filtered);
  }, [exercises, selectedMuscle, selectedBodyPart, selectedEquipment]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedMuscle('');
    setSelectedBodyPart('');
    setSelectedEquipment('');
  };

  // Get image for the muscle or body part
  const getMuscleImage = (muscle) => {
    // This would ideally come from your API or a mapping
    const muscleImages = {
      'abductors': '/images/muscles/abductors.png',
      'abs': '/images/muscles/abs.png',
      'biceps': '/images/muscles/biceps.png',
      'calves': '/images/muscles/calves.png',
      'chest': '/images/muscles/chest.png',
      'forearms': '/images/muscles/forearms.png',
      'glutes': '/images/muscles/glutes.png',
      'hamstrings': '/images/muscles/hamstrings.png',
      'lats': '/images/muscles/lats.png',
      'lower back': '/images/muscles/lower_back.png',
      'quadriceps': '/images/muscles/quadriceps.png',
      'shoulders': '/images/muscles/shoulders.png',
      'traps': '/images/muscles/traps.png',
      'triceps': '/images/muscles/triceps.png'
    };
    
    return muscleImages[muscle] || 'https://via.placeholder.com/150?text=' + muscle;
  };

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Muscle Group Planner</h2>
      
      {/* Muscle Selection Area */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Target Specific Muscles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Muscle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Muscle</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Muscles</option>
              {muscles.map((muscle) => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
          </div>
          
          {/* Body Part Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body Part</label>
            <select
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
          </div>
          
          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Equipment</option>
              {exercises
                .map(ex => ex.equipment)
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort()
                .map((equip) => (
                  <option key={equip} value={equip}>{equip}</option>
                ))}
            </select>
          </div>
        </div>
        
        {/* Filter actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300"
          >
            Reset Filters
          </button>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">
              {filteredExercises.length} exercises found
            </span>
            
            {/* View toggle */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 ${view === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`p-2 ${view === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Muscle Visualization */}
      {(selectedMuscle || selectedBodyPart) && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">
            {selectedMuscle ? `Targeted Muscle: ${selectedMuscle}` : `Body Part: ${selectedBodyPart}`}
          </h3>
          
          <div className="flex justify-center mb-4">
            <img 
              src={getMuscleImage(selectedMuscle || selectedBodyPart)} 
              alt={selectedMuscle || selectedBodyPart}
              className="max-h-64 object-contain"
            />
          </div>
          
          <p className="text-gray-700">
            {selectedMuscle && `${selectedMuscle} muscle exercises focus on strengthening and toning this specific muscle group.`}
            {selectedBodyPart && !selectedMuscle && `${selectedBodyPart} exercises work various muscles in this body area.`}
          </p>
        </div>
      )}
      
      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">No exercises found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className={view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredExercises.map((exercise) => (
            <div 
              key={exercise.id}
              className={view === 'grid' 
                ? "bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                : "bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 p-4 flex items-center"
              }
            >
              {view === 'grid' ? (
                <Link to={`/exercises/${exercise.id}`} className="block p-4">
                  <div className="h-48 flex items-center justify-center overflow-hidden rounded-lg mb-4">
                    <img 
                      src={exercise.gifUrl} 
                      alt={exercise.name} 
                      className="object-cover h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {exercise.bodyPart}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {exercise.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Equipment: {exercise.equipment}</p>
                </Link>
              ) : (
                <>
                  <div className="flex-shrink-0 h-20 w-20 rounded overflow-hidden mr-4">
                    <img 
                      src={exercise.gifUrl} 
                      alt={exercise.name} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-1">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        {exercise.bodyPart}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        {exercise.target}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Equipment: {exercise.equipment}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Link 
                      to={`/exercises/${exercise.id}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MuscleGroupPlanner;