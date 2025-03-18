import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import exerciseService from '../../services/exercise.service';

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exercise details and related exercises
  useEffect(() => {
    const fetchExerciseData = async () => {
      setLoading(true);
      try {
        // Get exercise details
        const exerciseData = await exerciseService.getExerciseById(id);
        setExercise(exerciseData);
        
        // Get related exercises (same target muscle or body part)
        const allExercises = await exerciseService.getExercises();
        const related = allExercises
          .filter(ex => 
            ex.id !== id && 
            (ex.target === exerciseData.target || ex.bodyPart === exerciseData.bodyPart)
          )
          .slice(0, 6); // Limit to 6 related exercises
        
        setRelatedExercises(related);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercise details:', err);
        setError('Failed to load exercise details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExerciseData();
    }
  }, [id]);

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

  // Not found state
  if (!exercise) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Exercise not found!</strong>
        <span className="block sm:inline"> The exercise you're looking for doesn't exist.</span>
        <Link to="/exercises" className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Back to Exercise List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/exercises" className="text-green-500 hover:text-green-700 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Exercise List
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Exercise Header */}
        <div className="p-6 bg-gray-50 border-b">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">{exercise.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {exercise.bodyPart}
            </span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Target: {exercise.target}
            </span>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              Equipment: {exercise.equipment}
            </span>
          </div>
        </div>
        
        {/* Exercise Content */}
        <div className="p-6 md:flex">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-4">
            <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
              <img 
                src={exercise.gifUrl} 
                alt={`${exercise.name} demonstration`} 
                className="max-h-96 object-contain"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-4">
            <h2 className="text-xl font-semibold mb-4">Exercise Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Instructions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                  {exercise.instructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  )) || (
                    <li>
                      Perform the exercise as shown in the animation, focusing on proper form and control throughout the movement.
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800">Benefits</h3>
                <p className="mt-2 text-gray-700">
                  This exercise targets your {exercise.target} muscles and helps build strength in your {exercise.bodyPart} region.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800">Tips for Proper Form</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                  <li>Focus on controlled movements rather than speed</li>
                  <li>Maintain proper breathing throughout the exercise</li>
                  <li>Ensure proper posture to prevent injuries</li>
                  <li>Start with lighter weights to master the form before increasing intensity</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                Add to Workout
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Exercises */}
      {relatedExercises.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Related Exercises</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedExercises.map((relatedExercise) => (
              <Link 
                to={`/exercises/${relatedExercise.id}`} 
                key={relatedExercise.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-4">
                  <div className="h-32 flex items-center justify-center overflow-hidden rounded-lg mb-4">
                    <img 
                      src={relatedExercise.gifUrl} 
                      alt={relatedExercise.name} 
                      className="object-cover h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{relatedExercise.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                      {relatedExercise.bodyPart}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                      {relatedExercise.target}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;