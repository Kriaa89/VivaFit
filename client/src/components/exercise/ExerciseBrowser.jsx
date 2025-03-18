import React, { useState, useEffect } from 'react';
import exerciseService from '../../services/exercise.service';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';

const ExerciseBrowser = () => {
  // State for exercises and filters
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter options
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [muscles, setMuscles] = useState([]);
  
  // Current filters
  const [filters, setFilters] = useState({
    bodyPart: '',
    equipment: '',
    target: '',
    search: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const exercisesPerPage = 9;
  
  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch filter options in parallel
        const [bodyPartsData, equipmentData, musclesData] = await Promise.all([
          exerciseService.getBodyParts(),
          exerciseService.getEquipment(),
          exerciseService.getMuscles()
        ]);
        
        setBodyParts(bodyPartsData);
        setEquipment(equipmentData);
        setMuscles(musclesData);
        
        // Fetch exercises with a reasonable limit
        const exercisesData = await exerciseService.getExercises({ limit: 100 });
        setExercises(exercisesData);
        setFilteredExercises(exercisesData);
      } catch (err) {
        setError('Failed to load exercises. Please try again later.');
        console.error('Error loading exercise data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter exercises when filters change
  useEffect(() => {
    if (exercises.length === 0) return;
    
    let result = [...exercises];
    
    // Apply filters
    if (filters.bodyPart) {
      result = result.filter(ex => 
        ex.bodyPart.toLowerCase() === filters.bodyPart.toLowerCase()
      );
    }
    
    if (filters.equipment) {
      result = result.filter(ex => 
        ex.equipment.toLowerCase() === filters.equipment.toLowerCase()
      );
    }
    
    if (filters.target) {
      result = result.filter(ex => 
        ex.target.toLowerCase() === filters.target.toLowerCase()
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm) || 
        ex.bodyPart.toLowerCase().includes(searchTerm) ||
        ex.target.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredExercises(result);
    setCurrentPage(0); // Reset to first page when filters change
  }, [filters, exercises]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      bodyPart: '',
      equipment: '',
      target: '',
      search: ''
    });
  };
  
  // Get current page exercises
  const getCurrentPageExercises = () => {
    const startIndex = currentPage * exercisesPerPage;
    return filteredExercises.slice(startIndex, startIndex + exercisesPerPage);
  };
  
  // Page count
  const pageCount = Math.ceil(filteredExercises.length / exercisesPerPage);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />
      
      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-50">
        <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Exercise Library</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Browse over 1000 exercises with step-by-step instructions, animations,
              and details on muscle groups targeted.
            </p>
          </div>
        </section>
        
        {/* Filters Section */}
        <section className="py-8 bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, muscle, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="bodyPart" className="block text-sm font-medium text-gray-700 mb-1">
                  Body Part
                </label>
                <select
                  id="bodyPart"
                  name="bodyPart"
                  value={filters.bodyPart}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Body Parts</option>
                  {bodyParts.map((part) => (
                    <option key={part.name} value={part.name}>{part.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment
                </label>
                <select
                  id="equipment"
                  name="equipment"
                  value={filters.equipment}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Equipment</option>
                  {equipment.map((item) => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Muscle
                </label>
                <select
                  id="target"
                  name="target"
                  value={filters.target}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Muscles</option>
                  {muscles.map((muscle) => (
                    <option key={muscle.name} value={muscle.name}>{muscle.name}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>
        
        {/* Results Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {loading ? 'Loading exercises...' : `${filteredExercises.length} Exercises Found`}
              </h2>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {/* Results Grid */}
            {!loading && !error && (
              <>
                {filteredExercises.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCurrentPageExercises().map(exercise => (
                      <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Exercise Image */}
                        {exercise.gifUrl ? (
                          <div className="h-48 overflow-hidden bg-gray-200">
                            <img 
                              src={exercise.gifUrl} 
                              alt={`${exercise.name} exercise`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image available</span>
                          </div>
                        )}
                        
                        {/* Exercise Details */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                          
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Target: </span>
                              {exercise.target || 'Not specified'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Body Part: </span>
                              {exercise.bodyPart || 'Not specified'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Equipment: </span>
                              {exercise.equipment || 'None required'}
                            </p>
                          </div>
                          
                          {/* Instructions Accordion */}
                          <details className="mt-3 border-t pt-2">
                            <summary className="font-medium text-green-600 cursor-pointer">
                              How to perform
                            </summary>
                            <div className="mt-2 text-sm text-gray-600">
                              {exercise.instructions ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {Array.isArray(exercise.instructions) 
                                    ? exercise.instructions.map((step, index) => (
                                        <li key={index}>{step}</li>
                                      ))
                                    : typeof exercise.instructions === 'string' 
                                      ? exercise.instructions.split('.').filter(Boolean).map((step, index) => (
                                          <li key={index}>{step.trim()}.</li>
                                        ))
                                      : <li>Follow proper form and technique.</li>
                                  }
                                </ul>
                              ) : (
                                <p>No instructions available. Look up proper form before attempting.</p>
                              )}
                            </div>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No exercises found matching your criteria.</p>
                    <button 
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Pagination */}
            {!loading && filteredExercises.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={`px-3 py-1 rounded ${
                      currentPage === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(pageCount).keys()].slice(
                      Math.max(0, currentPage - 2),
                      Math.min(pageCount, currentPage + 3)
                    ).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className={`px-3 py-1 rounded ${
                      currentPage >= pageCount - 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExerciseBrowser;