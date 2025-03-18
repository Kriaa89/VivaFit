import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';

function Dashboard() {
  const { currentUser } = useAuth();
  
  // Exercise feature cards data
  const exerciseFeatures = [
    {
      title: "Exercise Library",
      description: "Browse our comprehensive collection of exercises with detailed instructions and demonstrations",
      icon: "📚",
      link: "/exercises",
      color: "bg-blue-50 border-blue-500"
    },
    {
      title: "Workout Generator",
      description: "Create custom workouts based on your fitness level, available equipment, and goals",
      icon: "🏋️‍♀️",
      link: "/workout-generator",
      color: "bg-green-50 border-green-500"
    },
    {
      title: "Muscle Group Planner",
      description: "Target specific muscle groups with specialized exercises and routines",
      icon: "💪",
      link: "/muscle-group-planner",
      color: "bg-purple-50 border-purple-500"
    },
    {
      title: "Home & Gym Selector",
      description: "Find the perfect exercises for your workout location and available equipment",
      icon: "🏠",
      link: "/home-gym-selector",
      color: "bg-amber-50 border-amber-500"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />

      <main className="flex-grow pt-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h2>
            <p className="text-gray-600">Hello, {currentUser?.displayName || currentUser?.email}</p>
          </div>
          
          {/* Exercise Features Section */}
          <section className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Fitness Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exerciseFeatures.map((feature, index) => (
                <Link 
                  key={index} 
                  to={feature.link} 
                  className={`flex flex-col h-full rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${feature.color} p-6`}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{feature.icon}</span>
                    <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
                  <div className="text-green-600 font-medium flex items-center mt-auto">
                    Explore 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          
          {/* User Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Fitness Goals</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weight Loss</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-gray-600 font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Strength</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-gray-600 font-medium">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Endurance</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-gray-600 font-medium">30%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Workout Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-500">12</div>
                  <div className="text-sm text-gray-500">Workouts Completed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-500">5</div>
                  <div className="text-sm text-gray-500">This Week</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-500">320</div>
                  <div className="text-sm text-gray-500">Minutes Exercised</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">8</div>
                  <div className="text-sm text-gray-500">Different Exercises</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Features Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Coming Soon</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-green-500 mr-2">🍎</span>
                <span className="text-gray-700">Nutrition tracking</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-green-500 mr-2">📅</span>
                <span className="text-gray-700">Workout scheduling</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-green-500 mr-2">📷</span>
                <span className="text-gray-700">Progress photos</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-green-500 mr-2">🏆</span>
                <span className="text-gray-700">Community challenges</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;