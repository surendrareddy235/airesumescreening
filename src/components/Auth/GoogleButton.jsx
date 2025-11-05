import React from "react";

const GoogleButton = () => {
  return (
    <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">Sign up with Google</span>
    </button>
  );
};

export default GoogleButton;