import React from 'react';
import { useNavigate } from 'react-router-dom';

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-100 text-gray-800">
      <div className="max-w-2xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Disclaimer</h1>
        <p>
          The information provided on this website is for general informational purposes only. 
          All information on the site is provided in good faith, however we make no representation 
          or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, 
          reliability, availability, or completeness of any information on the site.
        </p>
        <p>
          Under no circumstance shall we have any liability to you for any loss or damage of any 
          kind incurred as a result of the use of the site or reliance on any information provided 
          on the site. Your use of the site and your reliance on any information on the site is 
          solely at your own risk.
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 bg-cyan-500 hover:bg-cyan-500 text-white px-6 py-2 cursor-pointer rounded-md transition duration-200"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
