import React from 'react';

const FitnessMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Distance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-400 bg-opacity-40 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-sm font-medium bg-blue-400 bg-opacity-40 px-3 py-1 rounded-full">Today</span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{metrics?.distance || 0}<span className="text-lg ml-1">km</span></h3>
        <p className="text-blue-100">Distance Covered</p>
      </div>

      {/* Steps Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-400 bg-opacity-40 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-sm font-medium bg-purple-400 bg-opacity-40 px-3 py-1 rounded-full">Today</span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{metrics?.steps || 0}</h3>
        <p className="text-purple-100">Total Steps</p>
      </div>

      {/* Calories Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-400 bg-opacity-40 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium bg-orange-400 bg-opacity-40 px-3 py-1 rounded-full">Today</span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{metrics?.calories || 0}</h3>
        <p className="text-orange-100">Calories Burned</p>
      </div>

      {/* Active Time Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-400 bg-opacity-40 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium bg-green-400 bg-opacity-40 px-3 py-1 rounded-full">Today</span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{metrics?.activeMinutes || 0}<span className="text-lg ml-1">min</span></h3>
        <p className="text-green-100">Active Time</p>
      </div>
    </div>
  );
};

export default FitnessMetrics;
