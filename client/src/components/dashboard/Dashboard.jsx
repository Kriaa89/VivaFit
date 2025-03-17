import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';

function Dashboard() {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to your Dashboard</h2>
          <p className="text-gray-600 mb-8">Hello, {currentUser?.displayName || currentUser?.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Workout Progress</h3>
              <p className="text-gray-600">Your workout stats will appear here</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Fitness Goals</h3>
              <p className="text-gray-600">Your fitness goals will appear here</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Dashboard;