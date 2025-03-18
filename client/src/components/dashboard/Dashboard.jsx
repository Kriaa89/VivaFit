import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';

function Dashboard() {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />

      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to your Dashboard</h2>
          <p className="text-gray-600 mb-8">Hello, {currentUser?.displayName || currentUser?.email}</p>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Getting Started</h3>
            <p className="text-gray-600">Welcome to VivaFit! Your profile has been set up successfully.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;