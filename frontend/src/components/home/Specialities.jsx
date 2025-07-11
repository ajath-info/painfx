import React from 'react';
import Urology from '../../images/urology.jpg';
import Orthopedic from '../../images/orthopedic.png';
import Neurology from '../../images/neurology.jpg';
import Cardiologist from '../../images/cardiologist.jpg';
import Dentist from '../../images/dentist.png';

const Specialities = () => {
  const specialities = [
    { name: 'Urology', img: Urology },
    { name: 'Neurology', img: Neurology },
    { name: 'Orthopedic', img: Orthopedic },
    { name: 'Cardiologist', img: Cardiologist },
    { name: 'Dentist', img: Dentist },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Clinic & Specialities</h2>
          <p className="text-gray-500 text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br />
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {specialities.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-50 h-50 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white border border-gray-200 hover:shadow-xl transition duration-300">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-50 h-50 object-contain ronded-full"
                />
              </div>
              <p className="mt-4 text-center text-lg font-semibold text-gray-800">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;