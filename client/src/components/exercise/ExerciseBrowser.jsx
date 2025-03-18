import React, { useState, useEffect } from 'react';
import exerciseService from '../../services/exercise.service';

const ExerciseBrowser = () => {
  // State management
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({
    bodyPart: '',
    equipment: '',
    target: '',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    bodyParts: [],
    equipment: [],
    muscles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [exercises, bodyParts, equipment, muscles] = await Promise.all([
          exerciseService.getExercises(),
          exerciseService.getBodyParts(),
          exerciseService.getEquipment(),
          exerciseService.getMuscles()
        ]);

        setExercises(exercises);
        setFilterOptions({
          bodyParts,
          equipment,
          muscles
        });
      } catch (error) {
        setError('Failed to load exercises. Please try again later.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter exercises based on selected criteria
  const getFilteredExercises = () => {
    return exercises.filter(exercise => {
      const matchBodyPart = !filters.bodyPart || exercise.bodyPart.toLowerCase() === filters.bodyPart.toLowerCase();
      const matchEquipment = !filters.equipment || exercise.equipment.toLowerCase() === filters.equipment.toLowerCase();
      const matchTarget = !filters.target || exercise.target.toLowerCase() === filters.target.toLowerCase();
      const matchSearch = !filters.search || 
        exercise.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        exercise.bodyPart.toLowerCase().includes(filters.search.toLowerCase()) ||
        exercise.target.toLowerCase().includes(filters.search.toLowerCase());

      return matchBodyPart && matchEquipment && matchTarget && matchSearch;
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        {error}
      </div>
    );
  }

  const filteredExercises = getFilteredExercises();

  return (
    <div className="container mx-auto p-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search exercises..."
          value={filters.search}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        
        {/* Filter dropdowns */}
        {['bodyPart', 'equipment', 'target'].map((filterType) => (
          <select
            key={filterType}
            name={filterType}
            value={filters[filterType]}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Filter by {filterType}</option>
            {filterOptions[filterType === 'target' ? 'muscles' : `${filterType}s`]?.map(item => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="border rounded-lg overflow-hidden shadow-sm">
            {exercise.gifUrl && (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
              <p><strong>Body Part:</strong> {exercise.bodyPart}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
              <p><strong>Target:</strong> {exercise.target}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No exercises found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ExerciseBrowser;