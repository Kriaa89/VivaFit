import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';

const ExerciseList = () => {
  // State to store fetched data
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data from ExerciseDB API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exercises
        const response = await axios.get('https://exercisedb-api.vercel.app/api/v1/exercises');
        setExercises(response.data.data || []);
      } catch (err) {
        setError('Failed to load exercises. Please try again later.');
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-50">
        <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Exercise List</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Browse through a list of exercises with detailed instructions and animations.
            </p>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map(exercise => (
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
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExerciseList;
