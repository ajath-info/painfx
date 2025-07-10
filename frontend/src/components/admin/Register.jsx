import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../images/logo-white.JPG';
 const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api'

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    f_name: '',
    l_name: '',
    phone: '',
    phone_code: '+91',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log(BASE_URL)
      const response = await axios.post(`${BASE_URL}/auth/register-admin`, formData);

      if (response.data?.status === 1) {
        setSuccess('Registered successfully!');
        setTimeout(() => navigate('/admin/dashboard'), 1500); // redirect to login
      } else {
        setError(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left - Logo */}
        <div className="md:w-1/2 flex mb-20 items-center justify-center p-10">
          <img src={Logo} alt="Logo" className="max-w-full h-auto" />
        </div>

        {/* Right - Register Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800">Register</h2>
          <p className="text-gray-500 mb-6">Create a new account</p>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="f_name"
              placeholder="First Name"
              value={formData.f_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="l_name"
              placeholder="Last Name"
              value={formData.l_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-md text-lg font-medium transition"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

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
            Already have an account?{' '}
            <Link to="/admin/auth/login" className="text-cyan-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
