import React from 'react';
import Logo from '../../images/logo-white.webp'; // Ensure the correct image path

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left side - Logo and Background */}
        <div className="md:w-1/2 flex mb-20 items-center justify-center p-10">
          <img src={Logo} alt="Logo" className="max-w-full h-auto" />
        </div>

        {/* Right side - Forgot Password Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 mb-6">Enter your email to reset your password</p>

          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-md text-lg font-medium transition"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Remembered your password?{' '}
            <a
              href="#"
              className="text-cyan-500 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
