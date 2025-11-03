import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Tag, PieChart, Gift, Activity, Lock } from 'lucide-react';

// Data for the features with shortened descriptions
const features = [
  {
    name: 'Auto Resume Screening',
    description: 'Instantly scan, parse, and structure hundreds of resumes at once.',
    IconComponent: FileText,
  },
  {
    name: 'AI-Powered Matching',
    description: 'Algorithms evaluate candidates against job descriptions for a perfect match score.',
    IconComponent: Sparkles,
  },
  {
    name: 'Job ID Management',
    description: 'Organize and track hiring campaigns using a unique ID for each upload.',
    IconComponent: Tag,
  },
  {
    name: 'Scoring Dashboard',
    description: 'View names, contacts, and AI-generated scores in a clean, exportable dashboard.',
    IconComponent: PieChart,
  },
  {
    name: 'Transparent Credits',
    description: 'Get $5 free credits to analyze and see the power of AIRS before purchasing more.',
    IconComponent: Gift,
  },
  {
    name: 'Real-Time Insights',
    description: 'Monitor total resumes, credits consumed, and candidate analytics at a glance.',
    IconComponent: Activity,
  },
  {
    name: 'Secure & Private',
    description: 'All your uploaded data remains fully encrypted, isolated, and confidential.',
    IconComponent: Lock,
  },
];

// Combine the features array twice for a seamless looping effect
const allFeatures = [...features, ...features];

const FeaturesGrid = () => {
  // We use this state to trigger the animation on mount, although the continuous loop is CSS-based
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state to apply the animation class once the component is ready
    setIsLoaded(true);
  }, []);

  return (
    <div className="py-20 bg-white font-inter">
      {/* Injecting custom CSS keyframes for the continuous scroll. */}
      {/* NOTE: Switched to standard <style> tags as 'jsx' prop might be causing issues */}
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }

          .scrolling-train {
            animation: scroll-left 45s linear infinite; /* Adjust time for speed */
            will-change: transform; /* Performance optimization for animation */
          }
          
          /* Define the size of a single feature card for a SMALLER SQUARE shape */
          .feature-card-square {
            min-width: 160px; /* Current Mobile Size */
            max-width: 160px; /* Ensure no stretching */
            aspect-ratio: 1 / 1; /* Enforce perfect square */
            padding: 0.75rem;    /* Reduced padding to maximize internal space */
          }

          /* Adjust size for responsiveness */
          @media (min-width: 1024px) {
              .feature-card-square {
                  min-width: 207px; /* Current Desktop Size */
                  max-width: 207px; /* Ensure no stretching */
                  aspect-ratio: 1 / 1; /* Enforce perfect square */
                  padding: 1rem;
              }
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-16">
          Key Highlights
        </h2>
        
        {/* --- Animation Container (Hides Overflow) --- */}
        {/* Added 'overflow-hidden' for the scroll functionality */}
        <div className="relative overflow-hidden py-4">
          
          {/* --- Scrolling Track (Applies Keyframe Animation) --- */}
          {/* Ensure the container is wide enough to hold the duplicated content (200% width) */}
          <div className={`flex flex-nowrap gap-6 w-[200%] ${isLoaded ? 'scrolling-train' : ''}`}>
            {allFeatures.map((feature, index) => {
              const Icon = feature.IconComponent;
              
              return (
                <div
                  key={index} // Use index as key since names are repeated
                  // Note: Removed shrink-0 here as it conflicts with explicit max-width in CSS
                  className={`feature-card-square relative bg-white rounded-xl shadow-md transition duration-300 ease-out border border-gray-100 cursor-pointer transform group hover:shadow-xl hover:scale-[1.05]`}
                >
                  
                  {/* --- ICON INTEGRATION with Silver Glow (Increased Size) --- */}
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 shadow-md mb-2">
                    <Icon 
                      className="h-4 w-4 text-gray-400 transition-all duration-300 
                                  group-hover:text-gray-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" 
                    />
                  </div>
                  
                  {/* Text styles adjusted to ensure wrapping in the small space (Increased Size) */}
                  <dt className="mt-1 text-base font-bold text-gray-900 leading-tight">
                    {feature.name}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-600 leading-snug break-words">
                    {feature.description}
                  </dd>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FeaturesGrid;
