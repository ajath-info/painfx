import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loginbanner from "../images/login-banner.png"
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Signup = () => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    password: '',
    phone: '',
    phone_code: '+91'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine role based on current path
  const isDoctor = location.pathname.includes('/doctor');
  const role = isDoctor ? 'doctor' : 'patient';
  
  const BASE_URL = process.env.BASE_URL

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.f_name.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.l_name.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const registrationData = {
        ...formData,
        role: role
      };
      
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        // Reset form
        setFormData({
          f_name: '',
          l_name: '',
          email: '',
          password: '',
          phone: '',
          phone_code: '+91'
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">

          {/* Left Image */}
          <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-8">
            <img src={Loginbanner} alt="Register Visual" className="w-full h-auto" />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isDoctor ? 'Doctor Registration' : 'Patient Registration'}
              </h2>
              <Link 
                to={isDoctor ? "/register" : "/doctor/register"} 
                className="text-blue-500 text-sm hover:underline"
              >
                {isDoctor ? 'Are you a Patient?' : 'Are you a Doctor?'}
              </Link>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                name="f_name"
                placeholder="First Name"
                value={formData.f_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              
              <input
                type="text"
                name="l_name"
                placeholder="Last Name"
                value={formData.l_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />

              <div className="flex space-x-2">
                <select
                  name="phone_code"
                  value={formData.phone_code}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20"
                  disabled={loading}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  disabled={loading}
                />
              </div>

              <input
                type="password"
                name="password"
                placeholder="Create Password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength="6"
                disabled={loading}
              />

              <div className="text-sm text-gray-600 text-right mb-2">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded transition ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                disabled={loading}
              >
                {loading ? 'Registering...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 w-1/2 border border-blue-800 text-blue-800 py-2 rounded hover:bg-blue-800 hover:text-white transition"
                  disabled={loading}
                >
                  <i className="fab fa-facebook-f"></i>
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 w-1/2 border border-red-500 text-red-500 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  disabled={loading}
                >
                  <i className="fab fa-google"></i>
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;