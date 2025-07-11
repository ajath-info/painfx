import React from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
const TodaysSchedule = () => {

 return (
  <DoctorLayout>
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-2">Schedule Timings</h2>
      <div className="mb-6">
        <label className="block text-xl font-medium text-gray-600 mb-2">Timing Slot Duration</label>
        <select className="mb-4 w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-white">
          <option >30 mins</option>
        </select>
      </div>
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-7 gap-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">SUNDAY</button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200">MONDAY</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">TUESDAY</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">WEDNESDAY</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">THURSDAY</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">FRIDAY</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">SATURDAY</button>
        </div>
      </div>
      <div>
        <label className="block text-lg font-medium text-gray-600 mb-4">Time Slots</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center">
            8:00 pm - 11:30 pm
          </button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center">
            11:30 pm - 1:30 pm
          </button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center">
            3:00 pm - 5:00 pm
          </button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center">
            6:00 pm - 11:00 pm
          </button>
        </div>
      </div>
    </div>
  </DoctorLayout>
  );
};

export default TodaysSchedule;