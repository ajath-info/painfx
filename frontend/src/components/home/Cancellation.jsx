import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const CancellationPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-cyan-500 text-white w-full py-6 px-4">
        <div className="max-w-9xl mx-auto text-lg">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> 
          <span className="font-semibold">Cancellation & Refund Policy</span>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10 text-gray-800">
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

          <div className="text-center">
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 cursor-pointer text-white px-6 py-2 rounded-md transition duration-200"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CancellationPolicy;
