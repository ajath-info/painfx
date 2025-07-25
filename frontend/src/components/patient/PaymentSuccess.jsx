import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import axios from "axios";
import BASE_URL from "../../config";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setPopupMessage("No payment session ID found. Verification failed.");
        setShowPopup(true);
        setIsVerifying(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setPopupMessage("Authentication error: No token found.");
          setShowPopup(true);
          setIsVerifying(false);
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

        if (error || response.data.status !== 1) {
          setPopupMessage(message || "Payment verification failed.");
          setShowPopup(true);
        } else {
          setPopupMessage("Payment verified successfully!");
          setShowPopup(true);
          setTimeout(() => {
            navigate("/patient/dashboard");
          }, 2000);
        }
      } catch (error) {
        setPopupMessage("An error occurred while verifying payment.");
        setShowPopup(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 mt-16 mb-16 text-center">
        {isVerifying ? (
          <div>
            <p className="text-lg text-gray-600">Verifying payment...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mt-4" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your payment. Your transaction has been completed successfully at{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              IST on Thursday, July 24, 2025.
            </p>
            <button
              onClick={() => navigate("/patient/dashboard")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;