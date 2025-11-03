import React, { useState } from 'react';

// NOTE: This URL object is required for the logo to display correctly.
// User must update this to a public URL to see the image.
const IMAGE_URLS = {
  // Placeholder is set to a common path, but you need to ensure airs-logo.png is in your public assets.
  LOGO_PLACEHOLDER: "/src/assets/airs-logo.png", 
  // SVG for the hamburger icon (three horizontal lines)
  MENU_ICON_SVG: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  // SVG for the close icon (X)
  CLOSE_ICON_SVG: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// --- Sub-Component: Navbar (Header) ---
const Navbar = ({ logoUrl = IMAGE_URLS.LOGO_PLACEHOLDER }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom class for the shining gray buttons
  const buttonClass = (isPrimary = false) => 
    `px-4 py-2 text-sm font-medium rounded-lg transition duration-300 ease-in-out shadow-md 
     transform hover:scale-[1.05] hover:shadow-xl
     ${isPrimary
       // Darker Gray/Primary Button (Sign Up)
       ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-70'
       // Lighter Gray/Secondary Button (Login)
       : 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-70'
       }`;

  const navLinkClass = "text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-150";

  return (
    <header className="fixed w-full z-20 bg-white/90 backdrop-blur-sm shadow-md">
      
      {/* Main Navigation (Desktop and Mobile Toggle) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          
          {/* Logo and Branding */}
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                {/* Image Placeholder. Remove 'filter invert' if your logo is black on transparent. */}
                <img src={logoUrl} alt="AIRS Logo" className="w-full h-full object-contain filter invert" /> 
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                VVAIRS<span className="text-gray-500">.</span>
              </span>
            </a>
            
            {/* Tagline integrated next to the logo on larger screens */}
            <span className="hidden lg:block text-sm font-medium text-gray-600 tracking-wider border-l border-gray-300 pl-4">
            </span>
          </div>
          
          {/* Desktop Navigation Links and Buttons */}
          <div className="hidden sm:flex sm:space-x-4 items-center">
            <a href="#about" className={navLinkClass}>About Us</a>
            <a href="#pricing" className={navLinkClass}>Pricing</a>
            
            {/* Login Button (Lighter Shining Gray) */}
            <button className={buttonClass(false)}>
              Login
            </button>
            
            {/* Sign Up Button (Darker Shining Gray) */}
            <button className={buttonClass(true)}>
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg"
            >
              {isMenuOpen ? IMAGE_URLS.CLOSE_ICON_SVG : IMAGE_URLS.MENU_ICON_SVG}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Content (Dropdown) */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white shadow-xl border-t border-gray-100 pb-4`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">About Us</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Pricing</a>
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200 space-y-2 px-4 flex flex-col">
          {/* Mobile Login Button */}
          <button className={buttonClass(false) + ' w-full'}>
            Login
          </button>
          {/* Mobile Sign Up Button */}
          <button className={buttonClass(true) + ' w-full'}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
