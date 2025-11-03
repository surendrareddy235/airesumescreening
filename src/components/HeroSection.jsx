import React from 'react';

// Recommended Image URL
const AI_SCREENING_DASHBOARD_IMAGE = "src/assets/dash-main.png"; // Replace with the actual hosted URL of the image above

const HeroSection = () => {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* $5 Free Credits Banner */}
        <div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-sm font-semibold text-gray-700 tracking-wide mb-4 shadow-inner">
          ⚡ New users get <span className="font-bold">$5 free credits</span> to experience intelligent screening!
        </div>

        {/* Headline */}
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl md:text-8xl leading-tight">
          Streamline Your Hiring with <span className="text-gray-600">AI-Powered Resume Screening</span>
        </h1>
        
        {/* Subheadline */}
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
          Let VV-AIRS handle resume analysis, job matching, and candidate scoring — so you can focus on what truly matters: <span className="font-semibold">hiring the right talent.</span>
        </p>
        
        {/* Call to Action Button - Primary Action (Black/Dark Gray theme) */}
        <div className="mt-10 flex justify-center space-x-4">
          <button className="px-10 py-4 text-lg font-bold text-white bg-gray-900 rounded-lg shadow-xl border border-gray-900 transition duration-300 ease-in-out hover:bg-gray-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50">
            Start Screening for Free
          </button>
        </div>

        {/* --- IMAGE INTEGRATION: AI Screening Dashboard --- */}
        <div className="mt-16 mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-96 w-full max-w-4xl flex items-center justify-center p-4">
          <img 
            src={AI_SCREENING_DASHBOARD_IMAGE} // Your generated image is used here!
            alt="AI Resume Screening Dashboard showing candidate rankings" 
            className="w-full h-full object-cover rounded-xl opacity-70"
          />
        </div>
        {/* ------------------------------------------------ */}

        {/* Tagline */}
        <p className="mt-10 text-xl font-semibold text-gray-600">
          <span className="font-bold">Fast. Accurate. AI-driven.</span>
        </p>

      </div>
    </div>
  );
};

export default HeroSection;
