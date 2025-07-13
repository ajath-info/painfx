import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../images/logo-white.JPG';

const BASE_URL = 'http://localhost:5000/api'; // Replace with your API base URL

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, formData);

      if (res.data && res.data.status === 1) {
        const { token, user } = res.data.payload;

        // Save token and user info in localStorage
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));

        alert('Login successful!');
        navigate('/admin/dashboard');
      } else {
        alert('Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Left side - Logo */}
        <div className="md:w-1/2 flex mb-20 items-center justify-center p-10">
          <img src={Logo} alt="Logo" className="max-w-full h-auto" />
        </div>

        {/* Right side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="text-gray-500 mb-6">Welcome back! Please login to your account.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-md text-lg font-medium transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex justify-end mt-2">
            <Link to="/admin/auth/forgot-password" className="text-cyan-500 hover:underline text-sm">Forgot Password?</Link>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">F</button>
            <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">G</button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/admin/auth/register" className="text-cyan-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
