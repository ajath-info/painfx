import React from 'react';
import Capture from '../../images/Capture.png';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden px-4">

      {/* Text Content */}
      <div className="text-center z-10 max-w-4xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 leading-tight">
          Search Doctor, Make an Appointment
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Discover the best doctors, clinics & hospitals nearest to you.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-5 flex flex-col md:flex-row md:items-end items-start justify-between space-y-4 md:space-y-0 md:space-x-4 w-full max-w-7xl">

          {/* Left Input (Location) with Helper */}
          <div className="flex flex-col items-start w-full md:w-[300px]">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 w-full">
              <i className="fas fa-map-marker-alt text-blue-500 mr-3 text-lg"></i>
              <input
                type="text"
                className="w-full focus:outline-none placeholder-gray-500 text-gray-700 text-base"
                placeholder="Search Location"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 pl-1">Based on your Location</p>
          </div>

          {/* Right Input (Search) with Helper */}
          <div className="flex flex-col items-start w-full md:w-[600px]">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 w-full">
              <i className="fas fa-search text-blue-500 mr-3 text-lg"></i>
              <input
                type="text"
                className="w-full focus:outline-none placeholder-gray-500 text-gray-700 text-base"
                placeholder="Search Doctors, Clinics, Hospitals, Diseases Etc"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 pl-1">Ex: Dental or Sugar Check up</p>
          </div>

          {/* Search Button */}
          <div className="mb-7 w-full md:w-auto flex justify-center md:justify-start">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-base font-medium flex items-center justify-center w-full md:w-auto"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Image */}
      <div className="absolute bottom-0 w-full mb-[-20px]">
        <img
          src={Capture}
          alt="Cityscape with Healthcare Elements"
          className="w-full h-auto object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x200?text=Cityscape+Image';
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;