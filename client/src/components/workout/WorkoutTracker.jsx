import React from 'react';
import RouteTracker from './RouteTracker';
import DashboardNavbar from '../dashboard/DashboardNavbar';

export default function WorkoutTracker() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Track Your Workout
          </h1>
          <p className="text-gray-600 mb-8">
            Use this tracker to record your outdoor running, walking, or cycling routes. 
            The app will track your position, calculate distance traveled, and display your 
            route on the map in real-time.
          </p>
          <RouteTracker />
        </div>
      </div>
    </div>
  );
}