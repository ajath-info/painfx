import React from 'react';
import Logo from '../../images/logo-white.JPG'; // Ensure correct image path

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left side - Logo and Background */}
        <div className="md:w-1/2 flex mb-20 items-center justify-center p-10">
          <img src={Logo} alt="Logo" className="max-w-full h-auto" />
        </div>

        {/* Right side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="text-gray-500 mb-6">Welcome back! Please login to your account.</p>

          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-md text-lg font-medium transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">
              F
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">
              G
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-cyan-500 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
