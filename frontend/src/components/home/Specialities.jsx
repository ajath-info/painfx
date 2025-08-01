import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Urology from '../../images/urology.webp';
import Orthopedic from '../../images/orthopedic.webp';
import Neurology from '../../images/neurology.webp';
import Cardiologist from '../../images/neurology.webp';
import Dentist from '../../images/dentist.webp';

const Specialities = () => {
const specialities = [
  { id: "1", name: 'Exposure Therapy', img: Urology,content:"We believe that informed patients heal better. That’s why we take the time to explain your condition and treatment plan clearly—helping you take control of your recovery" },
  { id: "2", name: 'Phychoanalysis', img: Neurology,content:"Our hands-on techniques, including soft/deep tissue massage and joint mobilisation or manipulation, are designed to relieve pain, restore movement, and accelerate healing."},
  { id: "3", name: 'Phychodynamic Therapy', img: Orthopedic,content:"These methods target muscular pain and tightness by releasing trigger points. They can also improve joint mobility and help reduce nerve-related symptoms." },
  { id: "4", name: 'Dialectical Behaviour', img: Cardiologist,content:"Movement is medicine. We create personalised exercise programs focused on improving strength, flexibility, balance, and functional movement—key to long-term recovery." },
  { id: "5", name: 'Cognitive Behaviour', img: Dentist , content:"Taping can be used to enhance posture, support joints, limit unwanted movement, and reduce stress on injured areas—offering both protection and relief." },
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
            At PainFx Physiotherapy, we offer a range of evidence-based treatments tailored to your unique needs:
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
                <Link to={`/specialitiesdetails/${item.id}`} className="cursor-pointer block w-full h-full">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  </Link>
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
                  <Link to={`/specialitiesdetails/${item.id}`} className="cursor-pointer block w-full h-full">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                </Link>
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
