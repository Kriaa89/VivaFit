import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About VivaFit</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Building a healthier world through personalized fitness technology
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <img 
                  src="https://via.placeholder.com/600x400?text=VivaFit+Story" 
                  alt="Our Story" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  VivaFit began as a student project at Coding Dojo, where our founders Abdallah Yessine Kriaa and Hamza Jbali identified a critical gap in the fitness app market: the lack of truly personalized workout experiences that adapt to users' unique goals and circumstances.
                </p>
                <p className="text-gray-600 mb-4">
                  After months of research, development, and testing, VivaFit was born – a comprehensive fitness platform that combines cutting-edge technology with evidence-based exercise science to deliver truly personalized fitness journeys.
                </p>
                <p className="text-gray-600">
                  Today, VivaFit continues to evolve, driven by our commitment to making fitness accessible, engaging, and effective for everyone, regardless of their starting point or ultimate goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Founders */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Founders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Founder 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <img 
                    src="https://via.placeholder.com/200?text=Abdallah+Yessine" 
                    alt="Abdallah Yessine Kriaa" 
                    className="w-48 h-48 object-cover rounded-full mb-6"
                  />
                  <h3 className="text-2xl font-bold text-gray-800">Abdallah Yessine Kriaa</h3>
                  <p className="text-green-600 font-medium mb-4">Co-Founder & Lead Developer</p>
                  <p className="text-gray-600 text-center mb-4">
                    A passionate full-stack developer with expertise in React, Node.js, and database management. Abdallah graduated from Coding Dojo with honors and leads the technical development of VivaFit.
                  </p>
                  <div className="flex space-x-4 mt-2">
                    <a href="https://github.com" className="text-gray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com" className="text-gray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Founder 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <img 
                    src="https://via.placeholder.com/200?text=Hamza+Jbali" 
                    alt="Hamza Jbali" 
                    className="w-48 h-48 object-cover rounded-full mb-6"
                  />
                  <h3 className="text-2xl font-bold text-gray-800">Hamza Jbali</h3>
                  <p className="text-green-600 font-medium mb-4">Co-Founder & UX Designer</p>
                  <p className="text-gray-600 text-center mb-4">
                    A talented designer and developer specializing in user experience, Hamza combines his Coding Dojo education with a background in fitness to ensure VivaFit is both beautiful and functional.
                  </p>
                  <div className="flex space-x-4 mt-2">
                    <a href="https://github.com" className="text-gray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com" className="text-gray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Journey</h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 ml-4 md:ml-0 h-full w-0.5 bg-gray-200 transform md:translate-x-px"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {/* Item 1 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 pb-4 md:pb-0">
                    <h3 className="text-xl font-bold text-gray-800">Conception at Coding Dojo</h3>
                    <p className="text-gray-600 mt-2">
                      The idea for VivaFit was born during our full-stack development program at Coding Dojo, where we recognized the need for a more personalized fitness app.
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div className="flex-1 md:pl-8 pt-4 md:pt-0"></div>
                </div>
                
                {/* Item 2 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 pb-4 md:pb-0 md:hidden"></div>
                  <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="flex-1 md:pl-8 pt-4 md:pt-0">
                    <h3 className="text-xl font-bold text-gray-800">Prototype Development</h3>
                    <p className="text-gray-600 mt-2">
                      Using React, Node.js, and MongoDB, we developed our first prototype, focusing on creating an intuitive user experience with responsive design.
                    </p>
                  </div>
                </div>
                
                {/* Item 3 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 pb-4 md:pb-0">
                    <h3 className="text-xl font-bold text-gray-800">Beta Testing & Refinement</h3>
                    <p className="text-gray-600 mt-2">
                      We conducted extensive user testing, gathering feedback from fitness enthusiasts and professionals to refine our algorithms and features.
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="flex-1 md:pl-8 pt-4 md:pt-0"></div>
                </div>
                
                {/* Item 4 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 pb-4 md:pb-0 md:hidden"></div>
                  <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div className="flex-1 md:pl-8 pt-4 md:pt-0">
                    <h3 className="text-xl font-bold text-gray-800">Official Launch</h3>
                    <p className="text-gray-600 mt-2">
                      After months of development and testing, we're proud to launch VivaFit, offering personalized fitness journeys for users of all levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              To empower people of all fitness levels to achieve their health goals through technology that adapts to their unique needs, making fitness accessible, engaging, and effective for everyone.
            </p>
            <Link to="/register" className="bg-white text-green-500 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Join Us Today
            </Link>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <img src="https://via.placeholder.com/80?text=React" alt="React" className="h-20 mx-auto mb-4" />
                <p className="font-medium text-gray-800">React.js</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <img src="https://via.placeholder.com/80?text=Node" alt="Node.js" className="h-20 mx-auto mb-4" />
                <p className="font-medium text-gray-800">Node.js</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <img src="https://via.placeholder.com/80?text=MongoDB" alt="MongoDB" className="h-20 mx-auto mb-4" />
                <p className="font-medium text-gray-800">MongoDB</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <img src="https://via.placeholder.com/80?text=Firebase" alt="Firebase" className="h-20 mx-auto mb-4" />
                <p className="font-medium text-gray-800">Firebase</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;