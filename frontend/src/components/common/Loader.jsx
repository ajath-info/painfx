import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Glowing spinning ring */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-white shadow-xl"></div>
          <div className="absolute inset-6 rounded-full bg-blue-100"></div>
        </div>

        {/* Pulsing text */}
        <p className="text-blue-600 text-lg font-semibold tracking-wide animate-pulse">
        </p>
      </div>
    </div>
  );
};

export default Loader;