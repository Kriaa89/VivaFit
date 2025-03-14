import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Footer from './Footer';
// Import the local image
import abdallahPhoto from './5ca129e1-826f-47e1-ab6c-99e2e63534db.jpg';

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
                  VivaFit began as a student project at Coding Dojo, where our founders Abdallah Yessine Kriaa and Hamza Jbali identified a critical gap in the fitness app market: the lack of truly personalized workout experiences.
                </p>
                <p className="text-gray-600 mb-4">
                  After months of research and development, VivaFit was born – combining cutting-edge technology with evidence-based exercise science to deliver personalized fitness journeys.
                </p>
                <p className="text-gray-600">
                  Today, VivaFit continues to evolve, making fitness accessible and effective for everyone, regardless of their starting point or ultimate goals.
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
              {/* Founder 1 - Using the actual photo */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <img 
                    src={abdallahPhoto} 
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

        {/* Our Journey - IMPROVED WITH SHORTER PARAGRAPHS */}
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
                      VivaFit was born during our full-stack development program at Coding Dojo.
                    </p>
                    <p className="text-gray-600 mt-1">
                      We identified a need for truly personalized workout experiences.
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
                      We built our first prototype using React, Node.js, and MongoDB.
                    </p>
                    <p className="text-gray-600 mt-1">
                      Our focus was creating an intuitive user experience with responsive design.
                    </p>
                  </div>
                </div>
                
                {/* Item 3 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 pb-4 md:pb-0">
                    <h3 className="text-xl font-bold text-gray-800">Beta Testing & Refinement</h3>
                    <p className="text-gray-600 mt-2">
                      We conducted extensive user testing with fitness enthusiasts.
                    </p>
                    <p className="text-gray-600 mt-1">
                      Valuable feedback helped us refine our algorithms and features.
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
                      After months of development, we proudly launched VivaFit.
                    </p>
                    <p className="text-gray-600 mt-1">
                      Our platform now offers personalized fitness journeys for users of all levels.
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

        {/* Tech Stack - FIXED WITH SVG ICONS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {/* React */}
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <div className="h-20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-blue-400" fill="currentColor">
                    <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 100-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046.255-.729.56-1.459.921-2.168-.36-.71-.666-1.44-.921-2.168-.256.72-.561 1.45-.922 2.167-.36-.708-.667-1.438-.922-2.167zM18.683 8.95c2.674.751 4.315 1.9 4.315 3.046 0 1.145-1.641 2.294-4.315 3.046a23.568 23.568 0 00-.921-2.168c.36-.71.666-1.44.921-2.168.256.729.561 1.459.921 2.168z" />
                    <path d="M5.536 8.837a25.338 25.338 0 00-1.363-3.578l-.133-.467.472-.119C7.982 3.784 10 2.275 10 .534s-2.018-3.25-5.536-4.139l-.472-.119-.133.467a23.53 23.53 0 00-1.363 3.578l-.101.213.101.213a23.307 23.307 0 001.363 3.578l.133.467zM8.95 5.317c.74-.254 1.46-.559 2.168-.92a23.55 23.55 0 01-2.168-.92c.172.361.33.729.473 1.102-.142.372-.3.74-.473 1.102z" />
                    <path d="M12 16.33a4.332 4.332 0 110-8.663 4.332 4.332 0 010 8.663zm0-7.775a3.442 3.442 0 100 6.884 3.442 3.442 0 000-6.884zM12 14.13a2.139 2.139 0 100-4.278 2.139 2.139 0 000 4.278zm0-.89a1.25 1.25 0 110-2.498 1.25 1.25 0 010 2.499z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800">React.js</p>
              </div>
              
              {/* Node.js */}
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <div className="h-20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-green-600" fill="currentColor">
                    <path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.037.129-.02.185.017l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.073-.037-.165-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.165.11.201l2 1.157c1.082.548 1.762-.095 1.762-.735V8.502c0-.11.091-.221.22-.221h.936c.108 0 .22.092.22.221v8.347c0 1.449-.788 2.294-2.164 2.294-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 01-.771-1.34V7.786c0-.55.293-1.064.771-1.339l7.316-4.237a1.637 1.637 0 011.544 0l7.317 4.237c.479.274.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.317 4.236c-.241.11-.516.165-.773.165zm2.256-5.816c-3.21 0-3.87-1.468-3.87-2.714 0-.11.092-.221.22-.221h.954c.11 0 .201.073.201.184.147.971.568 1.449 2.514 1.449 1.54 0 2.202-.35 2.202-1.175 0-.477-.185-.824-2.587-1.063-1.999-.2-3.246-.643-3.246-2.238 0-1.485 1.247-2.366 3.339-2.366 2.347 0 3.503.809 3.649 2.568a.205.205 0 01-.055.165c-.037.036-.091.073-.146.073h-.953a.212.212 0 01-.202-.164c-.221-1.01-.789-1.339-2.293-1.339-1.687 0-1.872.587-1.872 1.027 0 .533.237.696 2.514.99 2.256.293 3.32.715 3.32 2.294-.02 1.615-1.339 2.531-3.67 2.531l-.001-.001z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800">Node.js</p>
              </div>
              
              {/* MongoDB */}
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <div className="h-20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-green-500" fill="currentColor">
                    <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800">MongoDB</p>
              </div>
              
              {/* Firebase */}
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-md">
                <div className="h-20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-yellow-500" fill="currentColor">
                    <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
                  </svg>
                </div>
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