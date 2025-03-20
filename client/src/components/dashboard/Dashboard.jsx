import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../home/Footer';
import DashboardNavbar from './DashboardNavbar';
import { getIdToken } from '../../utils/auth';
import FitnessMetrics from '../metrics/FitnessMetrics';

function Dashboard() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [metrics, setMetrics] = useState({
    distance: 0,
    steps: 0,
    calories: 0,
    activeMinutes: 0
  });

  // Add photo upload handler
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const token = await getIdToken();
      const response = await fetch('http://localhost:8000/api/users/upload-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload photo');
      
      const result = await response.json();
      setUserProfile(prev => ({ ...prev, profilePhoto: result.photoUrl }));
    } catch (err) {
      setError('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

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
    if (!userProfile || !userProfile.height || !userProfile.weight) {
      return null;
    }
    
    let height = userProfile.height;
    let weight = userProfile.weight;
    
    // Convert height to meters if needed
    if (userProfile.heightUnit === 'cm') {
      height = height / 100;
    } else if (userProfile.heightUnit === 'ft') {
      height = height * 0.3048;
    } else if (userProfile.heightUnit === 'in') {
      height = height * 0.0254;
    }
    
    // Convert weight to kg if needed
    if (userProfile.weightUnit === 'lb') {
      weight = weight * 0.453592;
    }
    
    // Calculate BMI: weight (kg) / height^2 (m)
    const bmi = weight / (height * height);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  };

  // Determine BMI category
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Get appropriate color for BMI category
  const getBmiColor = (bmi) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNavbar />
      
      <main className="flex-grow px-4 pt-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
            <h1 className="text-4xl font-bold mb-4">Welcome back, {userProfile?.firstName || 'Fitness Friend'}! 👋</h1>
            <p className="text-xl text-blue-100">Ready to crush your fitness goals today?</p>
          </div>

          {/* Metrics Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Progress</h2>
            <FitnessMetrics metrics={metrics} />
          </section>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      {userProfile.profilePhoto ? (
                        <img 
                          src={userProfile.profilePhoto} 
                          alt="Profile"
                          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-green-500 border-4 border-white shadow-lg">
                          {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors shadow-md">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploading}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </label>
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{userProfile.firstName} {userProfile.lastName}</h2>
                  <p className="text-gray-600 mb-4">{userProfile.email}</p>
                  
                  <div className="mt-4">
                    <Link to="/profile" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Fitness Stats Card */}
              <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fitness Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Age</span>
                    <span className="font-semibold">{userProfile.age ? `${userProfile.age} years` : "Not specified"}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Height</span>
                    <span className="font-semibold">{userProfile.height ? `${userProfile.height} ${userProfile.heightUnit}` : "Not specified"}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Weight</span>
                    <span className="font-semibold">{userProfile.weight ? `${userProfile.weight} ${userProfile.weightUnit}` : "Not specified"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">BMI</span>
                    <div className="text-right">
                      {calculateBMI() ? (
                        <>
                          <span className="font-bold">{calculateBMI()}</span>
                          <span className={`block text-sm ${getBmiColor(calculateBMI())}`}>
                            {getBmiCategory(calculateBMI())}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Need height and weight</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fitness Profile Card */}
              <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Fitness Profile
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Fitness Level</span>
                    <span className="font-semibold capitalize">{userProfile.fitnessLevel || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Fitness Goal</span>
                    <span className="font-semibold capitalize">{userProfile.fitnessGoal || 'Not specified'}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 font-medium block mb-2">Member Since</span>
                    <span className="font-semibold">{formatDate(userProfile.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Workout Program Card */}
              <div className="md:col-span-3 bg-white rounded-xl shadow-md p-6 mt-4 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Your Workout Journey
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="text-purple-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Explore Exercises</h4>
                    <p className="text-gray-600 mb-4">Browse through a library of exercises tailored to your fitness level and goals.</p>
                    <Link 
                      to="/exercises" 
                      className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Browse Exercises
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg border border-green-100 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="text-green-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Create Workouts</h4>
                    <p className="text-gray-600 mb-4">Build custom workout routines that match your schedule and preferences.</p>
                    <Link 
                      to="/exercises" 
                      className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Workout
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="text-blue-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Track Progress</h4>
                    <p className="text-gray-600 mb-4">Monitor your fitness journey and see how far you've come.</p>
                    <Link 
                      to="/profile" 
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Stats
                    </Link>
                  </div>
                  
                  {/* New GPS Route Tracker Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border border-orange-100 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="text-orange-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">GPS Tracking</h4>
                    <p className="text-gray-600 mb-4">Track your outdoor runs, walks and rides with real-time GPS mapping.</p>
                    <Link 
                      to="/track-workout" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Track Route
                    </Link>
                  </div>
                </div>

                {/* Get started tip */}
                {(!userProfile.height || !userProfile.weight || !userProfile.age) && (
                  <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Pro tip:</strong> Complete your profile with your height, weight, and age to get more personalized workout recommendations.
                        </p>
                        <div className="mt-2">
                          <Link
                            to="/profile"
                            className="inline-flex items-center text-xs font-medium text-yellow-700 hover:text-yellow-600"
                          >
                            Complete Profile
                            <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Profile data not available. Please complete your profile setup to get the most out of VivaFit.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/profile"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;