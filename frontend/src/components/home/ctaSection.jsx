import React from 'react';

  function Ctasection() {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
          Let's get in touch
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
          We'd love to hear from you and help you get the care you need
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#0078FD] hover:bg-blue-700 text-white py-2 px-6 rounded-md text-sm sm:text-base transition">
            Book us on HealthEngine
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm sm:text-base transition">
            Book us on HotDoc
          </button>
        </div>
      </div>
    );
  }

  export default Ctasection;