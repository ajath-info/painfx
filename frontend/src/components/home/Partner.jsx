import React from 'react';
import logo1 from '../../images/partner.jpeg';

const LogoScroller = () => {
  const logos = [logo1, logo1, logo1, logo1]; // Replace with real logos

  return (
    <div className="overflow-hidden bg-white py-12 w-full">
      <h1 className="text-4xl font-semibold text-gray-800 mb-10 text-center">
        Partnership and Collaboration
      </h1>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Partner Logo ${index + 1}`}
              className="h-24 w-auto mx-8 flex-shrink-0 md:h-32 lg:h-36"
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
          animation: marquee 25s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LogoScroller;
