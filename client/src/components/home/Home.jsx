import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="relative">
      {/* Navbar */}
      <AppNavbar />

      {/* Add top padding to account for the fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold mb-4">Transform Your Life with VivaFit</h1>
              <p className="text-xl mb-8">
                Join the ultimate fitness journey with personalized workout plans, real-time progress tracking, and smart insights.
              </p>
              <div className="flex space-x-4">
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
                  Join Now
                </Link>
                <Link to="/login" className="border border-white hover:bg-white hover:text-green-500 text-white font-semibold py-3 px-6 rounded-lg">
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="https://via.placeholder.com/600x400?text=VivaFit+Hero"
                alt="Hero"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold mb-2">User Authentication</h3>
                <p className="text-gray-700">
                  Secure registration and login with Firebase and JWT ensuring your data stays protected.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold mb-2">Tailored Workout Plans</h3>
                <p className="text-gray-700">
                  Personalized workouts designed around your fitness level, goals, and available equipment.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-700">
                  Monitor your weekly progress and weight updates with beautiful visual charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src="https://via.placeholder.com/500x350?text=About+VivaFit"
                alt="About VivaFit"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About VivaFit</h2>
              <p className="text-gray-700 mb-4">
                At VivaFit, we empower you to reach your fitness goals with personalized workout plans, real-time progress tracking, and smart insights.
              </p>
              <p className="text-gray-700">
                Join our vibrant community and transform your life today. We believe fitness is for everyone, and we’re here to support you every step of the way.
              </p>
              <div className="mt-6">
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Join Now Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Fit?</h2>
            <p className="text-xl mb-8">
              Join now to kickstart your fitness journey with personalized plans and real‑time insights.
            </p>
            <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg">
              Join Now
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;