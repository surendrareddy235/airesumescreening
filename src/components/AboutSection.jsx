import React from 'react';

// Recommended 3D Illustration URL (from previous step)
const AI_RESUME_FLOW_IMAGE = "src/assets/home-img2.png";

const AboutSection = () => {
  return (
    <div id="about" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              About VV-AIRS
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              VV-AIRS AI Resume Screening** is an intelligent recruitment assistant that automates resume processing and candidate shortlisting.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Designed for HR teams and recruiters, VV-AIRS saves hours of manual work by analyzing bulk resumes, comparing them against job descriptions, and generating accurate candidate scores — all within seconds.
            </p>
          </div>
          
          {/* --- IMAGE INTEGRATION: Modern 3D Graphic --- */}
          <div className="mt-10 lg:mt-0 flex justify-center items-center">
            <div className="rounded-xl overflow-hidden shadow-2xl w-full max-w-lg">
              <img 
                src={AI_RESUME_FLOW_IMAGE}
                alt="3D illustration of resumes flowing into an AI system" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          {/* --------------------------------------------- */}

        </div>
      </div>
    </div>
  );
};

export default AboutSection;
