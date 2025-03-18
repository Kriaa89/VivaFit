 import React from 'react';

const WorkoutRecommendations = ({ recommendations }) => {
  // No recommendations yet
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Personalized Workout Plan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(exercise => (
          <div 
            key={exercise.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
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
                      {typeof exercise.instructions === 'string' 
                        ? exercise.instructions.split('.').filter(Boolean).map((step, index) => 
                            <li key={index}>{step.trim()}.</li>
                          )
                        : exercise.instructions.map((step, index) => 
                            <li key={index}>{step}</li>
                          )
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
    </div>
  );
};

export default WorkoutRecommendations;