import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          {/* Logo/Branding Column */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              AIRS<span className="text-gray-500">.</span>
            </span>
            <p className="mt-4 text-sm text-gray-400">
              Hire smarter with AI-powered resume screening.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} AIRS. All rights reserved.
            </p>
          </div>
          
          {/* Links Column 1: Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#about" className="text-base text-gray-400 hover:text-white transition duration-150">About Us</a></li>
              <li><a href="#contact" className="text-base text-gray-400 hover:text-white transition duration-150">Contact Us</a></li>
            </ul>
          </div>

          {/* Links Column 2: Product */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#pricing" className="text-base text-gray-400 hover:text-white transition duration-150">Pricing</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white transition duration-150">Features</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white transition duration-150">Dashboard</a></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-400 hover:text-white transition duration-150">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white transition duration-150">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;