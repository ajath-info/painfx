import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Banner from '../images/login-banner.webp';
import BASE_URL from '../config';

const OTPVerificationPage = () => {
  const [email, setEmail] = useState('omkar.pandey@brancosoft.com');
  const [otp, setOtp] = useState('2031');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${BASE_URL}/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setSuccess('OTP sent successfully to your email');
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
        setSuccess('');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully!');
        setError('');
        // Clear form
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
      } else {
        setError(data.message || 'Failed to reset password');
        setSuccess('');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
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

            {/* Email Address Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP Entry Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Enter 4-digit OTP
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                {/* <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="bg-cyan-500 text-white px-4 py-3 rounded hover:bg-cyan-600 transition disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button> */}
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <p className="text-sm text-red-500 mb-4">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-500 mb-4">
                {success}
              </p>
            )}

            {/* New Password Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
            </div>

            {/* Reset Password Button */}
            <button
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || !confirmPassword || !otp}
              className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OTPVerificationPage;
