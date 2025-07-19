import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import BASE_URL from '../../config';


const API_URL = `${BASE_URL}/api/partner/get-active`;

const LogoScroller = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!data.error && data.status === 1) {
          setPartners(data.payload);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Repeat logos to make the loop seamless
  const repeatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="bg-white py-10 border-y border-gray-200 w-full">
      <h2 className="text-3xl font-bold text-center mb-6">
        Partnership and Collaboration
      </h2>

      {!loading && partners.length > 0 && (
        <div className="relative">
          {/* Left blur gradient */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Right blur gradient */}
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <Marquee
            direction="left"
            speed={40}
            gradient={false}
            pauseOnHover
            className="overflow-hidden"
          >
            {repeatedPartners.map((partner, index) => {
              const imageUrl = `${BASE_URL}${partner.image_url}`;
              const hasLink = !!partner.website_url;
              const logo = (
                <img
                  src={imageUrl}
                  alt={partner.name}
                  className="h-16 md:h-20 w-auto object-contain mx-6 transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                />
              );

              return hasLink ? (
                <a
                  key={`${partner.id}-${index}`}
                  href={partner.website_url.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  {logo}
                </a>
              ) : (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex items-center justify-center"
                >
                  {logo}
                </div>
              );
            })}
          </Marquee>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-500 text-sm mt-6">Loading logos...</p>
      )}
    </div>
  );
};

export default LogoScroller;