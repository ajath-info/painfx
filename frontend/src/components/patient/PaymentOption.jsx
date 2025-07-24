import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import BASE_URL from "../../config";

const PaymentOption = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handlePayNow = async () => {
    if (!bookingData) {
      setPopupMessage("No booking data available.");
      setShowPopup(true);
      return;
    }

    const { amount, appointment_id, doctor_id } = bookingData;
    if (!amount || !appointment_id || !doctor_id) {
      setPopupMessage("Missing required booking information. Please try again.");
      setShowPopup(true);
      return;
    }

    try {
      setPopupMessage("Initiating payment...");
      setShowPopup(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setPopupMessage("Authentication error: No token found.");
        return;
      }

      const payload = {
        amount: parseFloat(amount),
        appointment_id: parseInt(appointment_id, 10),
        doctor_id: parseInt(doctor_id, 10),
      };

      const response = await axios.post(
        `${BASE_URL}/payment/create-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { error, message, payload: responsePayload } = response.data;

      if (error || response.data.status !== 1) {
        setPopupMessage(message || "Failed to create payment session.");
        return;
      }

      const { sessionUrl } = responsePayload;
      setPopupMessage("Redirecting to payment gateway...");
      window.location.href = sessionUrl;
    } catch (error) {
      setPopupMessage("An error occurred while initiating payment. Please try again.");
      setShowPopup(true);
    }
  };

  const handlePayLater = () => {
    setPopupMessage("You can pay after consultation. Booking confirmed.");
    setShowPopup(true);
    setTimeout(() => {
      navigate("/patient/dashboard");
    }, 2000);
  };

  const verifyPaymentSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopupMessage("Authentication error: No token found.");
        setShowPopup(true);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/payment/verify-session`,
        { session_id: sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { error, message } = response.data;

      if (error) {
        setPopupMessage(message || "Payment verification failed.");
        setShowPopup(true);
        return;
      }

      setPopupMessage("Payment verified successfully!");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 2000);
    } catch (error) {
      setPopupMessage("An error occurred while verifying payment.");
      setShowPopup(true);
    }
  };

  if (!bookingData) {
    return <div className="p-6 text-red-500">Invalid navigation. No booking data found.</div>;
  }

  return (
    <>
      <Header />

      {/* Popup with blur background */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white px-6 py-5 rounded-xl shadow-xl text-center max-w-sm mx-auto border border-gray-300">
            <p className="text-lg font-semibold text-gray-800">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Payment Box */}
      <div className="max-w-2xl md:max-w-4xl h-[50vh] mx-auto px-6 py-12 mt-16 mb-16 bg-white shadow-lg rounded-lg animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Choose Payment Option</h1>
        <p className="text-center text-gray-600 mb-8">
  Appointment on{" "}
  <strong>
    {new Date(bookingData.appointment_date).toLocaleDateString("en-GB")}
  </strong>{" "}
  at{" "}
  <strong>
    {new Date(`1970-01-01T${bookingData.appointment_time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
  </strong>
  <br />
  {/* with Doctor ID: <strong>{bookingData.doctor_id}</strong> */}
</p>


        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <button
            onClick={handlePayNow}
            className="bg-green-500 text-white text-lg px-8 py-3 rounded-lg shadow hover:bg-green-600 transition-all duration-200"
          >
            Pay Now
          </button>
          <button
            onClick={handlePayLater}
            className="bg-gray-100 text-gray-800 text-lg px-8 py-3 rounded-lg shadow hover:bg-gray-200 transition-all duration-200"
          >
            Pay After Consultation
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentOption;
