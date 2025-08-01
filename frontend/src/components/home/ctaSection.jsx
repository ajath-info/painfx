import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';

function Ctasection() {
  const [cta, setCta] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/compliance/get-active/cta`);
      setCta(res.data.payload || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setCta([]); // Set empty array on error to avoid further issues
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>; // Optional loading state
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
        Let's get in touch
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
        We'd love to hear from you and help you get the care you need
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {cta.map((item, index) => (
          <button
            key={index}
            className={`cursor-pointer ${index === 0 ? 'bg-cyan-400 hover:bg-cyan-500' : 'bg-green-500 hover:bg-green-700'} text-white py-2 px-6 rounded-md text-sm sm:text-base transition`}
            onClick={() => window.open(item.redirect_link, '_blank')}
          >
            {item.name || `Button ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Ctasection;