import React from 'react';
import logo1 from '../../images/partner.jpeg';

const LogoScroller = () => {
  const logos = [logo1, logo1, logo1, logo1,  logo1];

  return (
    <div className="overflow-hidden bg-white py-8 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
  Partnership and Collaboration
</h1>

      <div className="flex flex-nowrap bg-gray-400 p-8">
        <div className="flex flex-nowrap animate-marquee">
          {logos.map((logo, index) => (
            <img
              key={`first-${index}`}
              src={logo}
              alt={`Medical Specialty Logo ${index + 1}`}
              className="h-16 w-auto mx-6 flex-shrink-0"
            />
          ))}
          {logos.map((logo, index) => (
            <img
              key={`second-${index}`}
              src={logo}
              alt={`Medical Specialty Logo ${index + 1}`}
              className="h-16 w-auto mx-6 flex-shrink-0"
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 15s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LogoScroller;