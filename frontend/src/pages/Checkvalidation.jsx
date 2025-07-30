import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Banner from '../images/login-banner.webp';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (otp === '123456') {
      setIsVerified(true);
      setError('');
    } else {
      setIsVerified(false);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg overflow-hidden">
          {/* Left side image */}
          <div className="md:w-1/2 w-full h-64 md:h-auto flex items-center justify-center bg-gray-200">
            <img
              src={Banner}
              alt="Verification"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side form */}
          <div className="md:w-1/2 w-full p-6 sm:p-10 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
              OTP Verification
            </h2>

            {/* OTP input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
              <button
                onClick={handleVerify}
                className="bg-cyan-500 cursor-pointer text-white px-5 py-3 rounded hover:bg-cyan-600 transition"
              >
                Verify
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4 text-center md:text-left">
                {error}
              </p>
            )}

            {/* Password Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isVerified}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isVerified}
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                </label>
                <input
                  type="submit"
                  className="mt-6 cursor-pointer bg-cyan-500 text-white w-full p-3 border rounded-lg"
                />
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OTPVerificationPage;
