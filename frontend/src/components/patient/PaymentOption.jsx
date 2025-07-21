import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientLayout from "../../layouts/PatientLayout";

const PaymentOption = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingData } = location.state || {};

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handlePayNow = () => {
    setPopupMessage("Redirecting to payment gateway...");
    setShowPopup(true);
    // Example: navigate('/patient/payment-gateway', { state: { bookingData } });
  };

  const handlePayLater = () => {
    setPopupMessage("You can pay after consultation. Booking confirmed.");
    setShowPopup(true);
    setTimeout(() => {
      navigate("/patient/dashboard");
    }, 2000);
  };

  if (!bookingData) {
    return <div className="p-6 text-red-500">Invalid navigation. No booking data found.</div>;
  }

  return (
    <PatientLayout>
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-md text-center max-w-sm mx-auto">
            <p className="text-lg text-gray-800">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-6 py-12 bg-white shadow-md mt-12 rounded">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#0078FD]">Choose Payment Option</h1>
        <p className="text-center mb-6 text-gray-700">
          Appointment for <strong>{bookingData.appointment_date}</strong> at <strong>{bookingData.appointment_time}</strong> with Doctor ID: {bookingData.doctor_id}
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            onClick={handlePayNow}
            className="bg-green-500 text-white text-lg px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Pay Now
          </button>
          <button
            onClick={handlePayLater}
            className="bg-gray-200 text-gray-800 text-lg px-6 py-3 rounded hover:bg-gray-300 transition"
          >
            Pay After Consultation
          </button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PaymentOption;