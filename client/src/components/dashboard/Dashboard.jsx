import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AppNavbar from '../home/AppNavbar';
import Footer from '../home/Footer';
import DashboardNavbar from './DashboardNavbar';
import { getIdToken } from '../../utils/auth';

function Dashboard() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const token = await getIdToken();
        
        if (!token) {
          throw new Error('No authentication token available');
        }
        
        const response = await fetch('http://localhost:8000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const profileData = await response.json();
        
        if (profileData.success && profileData.data) {
          setUserProfile(profileData.data);
        } else {
          throw new Error(profileData.message || 'Failed to load profile data');
        }
      } catch (err) {
        console.error('Profile loading error:', err);
        setError(err.message || 'An error occurred while loading your profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, []);

  // Format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (!userProfile || !userProfile.height || !userProfile.weight) return null;
    
    let heightInMeters, weightInKg;
    
    // Convert height to meters
    switch (userProfile.heightUnit) {
      case 'cm':
        heightInMeters = userProfile.height / 100;
        break;
      case 'm':
        heightInMeters = userProfile.height;
        break;
      case 'ft':
        heightInMeters = userProfile.height * 0.3048;
        break;
      case 'in':
        heightInMeters = userProfile.height * 0.0254;
        break;
      default:
        heightInMeters = userProfile.height / 100; // Default to cm
    }
    
    // Convert weight to kg
    weightInKg = userProfile.weightUnit === 'lb' 
      ? userProfile.weight * 0.453592 
      : userProfile.weight;
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Determine BMI category
  const getBmiCategory = (bmi) => {
    if (!bmi) return '';
    
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obesity';
  };

  // Get appropriate color for BMI category
  const getBmiColor = (bmi) => {
    if (!bmi) return 'text-gray-500';
    
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'text-blue-500';
    if (bmiValue < 25) return 'text-green-500';
    if (bmiValue < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppNavbar />

      <main className="flex-grow pt-16">
        <DashboardNavbar />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Use a default profile avatar */}
                      <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-green-500 border-4 border-white shadow-lg">
                        {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{userProfile.firstName} {userProfile.lastName}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  
                  <div className="mt-6">
                    <Link to="/profile" className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-300">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Fitness Stats Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fitness Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Age</span>
                    <span className="font-medium">{userProfile.age} years</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">{userProfile.height} {userProfile.heightUnit}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{userProfile.weight} {userProfile.weightUnit}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">BMI</span>
                    <div className="text-right">
                      <span className="font-bold">{calculateBMI() || 'N/A'}</span>
                      {calculateBMI() && (
                        <span className={`block text-sm ${getBmiColor(calculateBMI())}`}>
                          {getBmiCategory(calculateBMI())}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fitness Profile Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fitness Profile</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Fitness Level</span>
                    <span className="font-medium capitalize">{userProfile.fitnessLevel || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Fitness Goal</span>
                    <span className="font-medium capitalize">{userProfile.fitnessGoal || 'Not specified'}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 block mb-2">Member Since</span>
                    <span className="font-medium">{formatDate(userProfile.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Profile data not available. Please complete your profile setup.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;