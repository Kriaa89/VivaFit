import React, { useState } from 'react';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';
import WorkoutRecommendationForm from './WorkoutRecommendationForm';
import WorkoutRecommendations from './WorkoutRecommendations';

const WorkoutPlanner = () => {
  const [recommendations, setRecommendations] = useState([]);

  const handleRecommendationsReceived = (data) => {
    setRecommendations(data);
    // Scroll to recommendations section
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById('recommendations-section')?.offsetTop - 100,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Personalized Workout Planner</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get AI-powered workout recommendations tailored to your body type, fitness goals, and available equipment
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <WorkoutRecommendationForm onRecommendationsReceived={handleRecommendationsReceived} />
          </div>
        </section>

        {/* Recommendations Section */}
        <section id="recommendations-section" className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            {recommendations.length > 0 ? (
              <WorkoutRecommendations recommendations={recommendations} />
            ) : (
              <div className="text-center text-gray-500">
                Fill out the form above to get your personalized workout recommendations.
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Benefits of Personalized Workouts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Tailored to Your Body</h3>
                <p className="text-gray-600">
                  Receive workout plans designed specifically for your body type, ensuring optimal results and reduced risk of injury.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="text-blue-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Achieve Goals Faster</h3>
                <p className="text-gray-600">
                  Focus on exercises scientifically proven to help you reach your specific fitness goals more efficiently.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="text-purple-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Work with What You Have</h3>
                <p className="text-gray-600">
                  Get effective workout routines using only the equipment you have access to, whether at home or in a gym.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WorkoutPlanner;