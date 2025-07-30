import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { FaArrowLeft } from 'react-icons/fa';

const CancellationPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* Breadcrumb */}
       <div className="bg-cyan-500 text-white w-full py-6 px-4">
        <div className="max-w-9xl mx-auto flex justify-between items-center text-lg">
          <div>
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold">Cancellation</span>
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

        <div className="max-w-7xl w-full bg-gray-50 rounded-xl p-8 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Cancellation & Refund Policy
          </h1>

          <p>
            We understand that sometimes plans change. If you need to cancel your appointment or booking, please read the following policy carefully.
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>
              Cancellations made at least <strong>24 hours</strong> before the scheduled appointment time will receive a full refund.
            </li>
            <li>
              Cancellations made within <strong>24 hours</strong> of the appointment will not be eligible for a refund.
            </li>
            <li>
              In the case of emergencies or unavoidable circumstances, please contact us directly to discuss possible exceptions.
            </li>
            <li>
              Refunds, if applicable, will be processed within <strong>5-7 business days</strong> to your original payment method.
            </li>
          </ul>

          <p>
            We appreciate your understanding and cooperation. For further queries, feel free to reach out to our support team.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CancellationPolicy;
