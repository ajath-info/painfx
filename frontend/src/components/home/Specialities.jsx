import React, { useEffect, useRef } from 'react';
import Urology from '../../images/urology.jpg';
import Orthopedic from '../../images/orthopedic.png';
import Neurology from '../../images/neurology.jpg';
import Cardiologist from '../../images/cardiologist.jpg';
import Dentist from '../../images/dentist.png';

const Specialities = () => {
  const specialities = [
    { name: 'Exposure Therapy', img: Urology },
    { name: 'Phychoanalysis', img: Neurology },
    { name: 'Phychodynamic Therapy', img: Orthopedic },
    { name: 'Dialectical Behaviour', img: Cardiologist },
    { name: 'Cognitive Behaviour', img: Dentist },
  ];

  const scrollRef = useRef(null);

  // Auto-scroll every 1 second
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (!scrollContainer) return;
      const cardWidth = scrollContainer.firstChild?.offsetWidth || 0;
      currentIndex = (currentIndex + 1) % specialities.length;
      scrollContainer.scrollTo({
        left: cardWidth * currentIndex,
        behavior: 'smooth',
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

        {/* Mobile Auto-Scroll View (1 Card at a Time) */}
        <div className="block md:hidden overflow-hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {specialities.map((item, index) => (
              <div
                key={index}
                className="flex-none w-full snap-center flex flex-col items-center px-8"
              >
                <div className="w-52 h-52 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white border border-gray-200">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-center text-lg font-semibold text-gray-800">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Layout on Medium and Up */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {specialities.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white border border-gray-200">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
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
