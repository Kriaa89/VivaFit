import React from 'react';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
    return (
    <nav className="bg-gray-800 fixed w-full z-10 top-0 shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              VivaFit
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/services" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Services</Link>
                <Link to="/programs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Programs</Link>
                <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
                <Link to="/pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</Link>
              </div>
            </div>
          </div>
          <div className="flex">
            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log In</Link>
            <Link to="/register" className="ml-4 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium">Join Now</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
