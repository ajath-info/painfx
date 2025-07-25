import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-12 mt-16 mb-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed!</h1>
        <p className="text-gray-600 mb-8">Unfortunately, your payment could not be processed. Please try again.</p>
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
      <Footer />
    </>
  );
};

export default PaymentFailure;