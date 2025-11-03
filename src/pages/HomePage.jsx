import React from 'react';

// Assuming these components are defined below or in separate files
import Navbar from "../components/Navbar";
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesGrid from '../components/FeaturesGrid';
import Footer from '../components/Footer';

// The main component that renders the full homepage
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;