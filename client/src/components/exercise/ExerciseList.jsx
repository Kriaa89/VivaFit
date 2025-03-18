import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import exerciseService from '../../services/exercise.service';

const ExerciseList = () => {
  // States for data
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [muscles, setMuscles] = useState([]);
  
  // States for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [exercisesData, bodyPartsData, equipmentData, musclesData] = await Promise.all([
          exerciseService.getExercises(),
          exerciseService.getBodyParts(),
          exerciseService.getEquipment(),
          exerciseService.getMuscles()
        ]);
        
        setExercises(exercisesData);
        setFilteredExercises(exercisesData);
        setBodyParts(bodyPartsData);
        setEquipment(equipmentData);
        setMuscles(musclesData);
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

  // Filter exercises based on search query and selected filters
  useEffect(() => {
    if (!exercises.length) return;
    
    let results = [...exercises];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(exercise => 
        exercise.name.toLowerCase().includes(query)
      );
    }
    
    // Apply body part filter
    if (selectedBodyPart) {
      results = results.filter(exercise => 
        exercise.bodyPart.toLowerCase() === selectedBodyPart.toLowerCase()
      );
    }
    
    // Apply equipment filter
    if (selectedEquipment) {
      results = results.filter(exercise => 
        exercise.equipment.toLowerCase() === selectedEquipment.toLowerCase()
      );
    }
    
    // Apply target muscle filter
    if (selectedMuscle) {
      results = results.filter(exercise => 
        exercise.target.toLowerCase() === selectedMuscle.toLowerCase()
      );
    }
    
    setFilteredExercises(results);
  }, [exercises, searchQuery, selectedBodyPart, selectedEquipment, selectedMuscle]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setSelectedMuscle('');
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
      <h2 className="text-2xl font-bold mb-6">Exercise Library</h2>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Body Part Filter */}
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
          
          {/* Equipment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Equipment</option>
              {equipment.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          
          {/* Target Muscle Filter */}
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
        </div>
        
        {/* Filter actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300"
          >
            Reset Filters
          </button>
          
          <div className="text-sm text-gray-600">
            {filteredExercises.length} exercises found
          </div>
        </div>
      </div>
      
      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">No exercises found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Link 
              to={`/exercises/${exercise.id}`} 
              key={exercise.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;