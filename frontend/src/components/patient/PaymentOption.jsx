import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PatientLayout from "../../layouts/PatientLayout";
import BASE_URL from "../../config";

const PaymentOption = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingData } = location.state || {};
  console.log("bookingData", bookingData)

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handlePayNow = async () => {
    if (!bookingData) {
      setPopupMessage("No booking data available.");
      setShowPopup(true);
      return;
    }

    // Validate required fields
    const { amount, appointment_id, doctor_id } = bookingData;
    if (!amount || !appointment_id || !doctor_id) {
      console.error("Missing required booking data:", {
        amount,
        appointment_id,
        doctor_id,
      });
      setPopupMessage("Missing required booking information. Please try again.");
      setShowPopup(true);
      return;
    }

    try {
      setPopupMessage("Initiating payment...");
      setShowPopup(true);

      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setPopupMessage("Authentication error: No token found.");
        setShowPopup(true);
        return;
      }

      // Ensure doctor_id is sent as a number
      const payload = {
        amount: parseFloat(amount), // Ensure amount is a float
        appointment_id: parseInt(appointment_id, 10), // Ensure appointment_id is an integer
        doctor_id: parseInt(doctor_id, 10), // Ensure doctor_id is an integer
      };

      console.log("Sending payload to /payment/create-session:", payload);

      // Create payment session
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
        console.error("Payment session creation failed:", response.data);
        setPopupMessage(message || "Failed to create payment session.");
        setShowPopup(true);
        return;
      }

      // Redirect to Stripe checkout URL
      const { sessionUrl, sessionId } = responsePayload;
      setPopupMessage("Redirecting to payment gateway...");
      window.location.href = sessionUrl; // Redirect to Stripe checkout
    } catch (error) {
      console.error("Payment session creation failed:", error.response?.data || error);
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

  // Function to verify payment session (call this in a separate component or after redirect)
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
        console.error("Payment verification failed:", response.data);
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
      console.error("Payment verification failed:", error.response?.data || error);
      setPopupMessage("An error occurred while verifying payment.");
      setShowPopup(true);
    }
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