import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardNavbar from './DashboardNavbar';
import Footer from '../home/Footer';

function Dashboard() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from the server
    fetch('/api/dashboard')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />

      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Welcome to VivaFit, {currentUser?.displayName || 'Fitness Enthusiast'}!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Your profile has been successfully set up. You're now ready to start your fitness journey with us!
            </p>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-700">
                Get ready to achieve your fitness goals! Your personalized workout plans and tracking tools are now available.
              </p>
              {data && (
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">Dashboard Data:</h3>
                  <pre className="bg-gray-200 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;