import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { DollarSign, CircleDollarSign } from 'lucide-react';


const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header />

   <div className="bg-cyan-500 text-white w-full py-6 px-4">
  <div className="max-w-9xl mx-auto flex justify-between items-center text-lg">
    <div>
      <Link to="/" className="hover:underline">Home</Link>
      <span className="mx-2">/</span>
      <span className="font-semibold">Disclaimer</span>
    </div>
    <button 
  onClick={() => navigate(-1)} 
  className="bg-white text-cyan-500 hover:bg-cyan-500 hover:text-white border border-white px-6 py-2 cursor-pointer rounded-md transition duration-200 flex items-center gap-2"
>
  <FaArrowLeft className="text-sm" />
  <span>Go Back</span>
</button>
  </div>
</div>

   <div className="min-h-[20vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gray-50 text-gray-800">

      <div className="max-w-5xl bg-gray-50  rounded-xl p-8 space-y-6">
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
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Disclaimer;
