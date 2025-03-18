import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../services/api';

const WorkoutRecommendationsCard = () => {
  const [recentRecommendations, setRecentRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchRecommendationHistory = async () => {
      try {
        const response = await api.getRecommendationHistory();
        if (response.success && response.data) {
          // Sort by date and take the most recent 3
          const sortedRecs = response.data.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          ).slice(0, 3);
          
          setRecentRecommendations(sortedRecs);
        }
      } catch (error) {
        console.error('Error fetching recommendation history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendationHistory();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Workout Recommendations</h2>
        <Link 
          to="/workout-planner" 
          className="text-green-500 hover:text-green-700 flex items-center text-sm font-medium"
        >
          Get Recommendations
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : recentRecommendations.length > 0 ? (
        <div className="space-y-4">
          {recentRecommendations.map((rec, index) => (
            <div key={index} className="border rounded-md p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">Workout for: {rec.criteria?.goal || 'Overall fitness'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(rec.timestamp).toLocaleDateString()} • 
                    {rec.criteria?.fitnessLevel && ` ${rec.criteria.fitnessLevel.charAt(0).toUpperCase() + rec.criteria.fitnessLevel.slice(1)} level`}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {rec.exercises?.length || 0} exercises
                </span>
              </div>
              
              {rec.exercises && rec.exercises.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Includes:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rec.exercises.slice(0, 3).map((ex, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {ex.name}
                      </span>
                    ))}
                    {rec.exercises.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{rec.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {recentRecommendations.length > 0 && (
            <Link 
              to="/workout-planner" 
              className="block w-full text-center py-2 mt-3 text-sm text-green-600 hover:text-green-700"
            >
              View All Workout Plans
            </Link>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-600 mb-3">No workout recommendations yet</p>
          <Link 
            to="/workout-planner" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get Your First Recommendation
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkoutRecommendationsCard;