import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} VivaFit. All rights reserved.</p>
        <p className="mt-2">
          Created by Full Stack Developer <strong>Abdallah Yessine Kriaa</strong> &amp; <strong>Hamza Jbali</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
