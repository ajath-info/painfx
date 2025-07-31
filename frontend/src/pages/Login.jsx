import React, { useEffect, useState } from 'react';
import loginbanner from "../images/login-banner.webp";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BASE_URL from '../../src/config';
import { Eye, EyeOff } from 'lucide-react';
import Loader from '../components/common/Loader';

const Login = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      const parsedUser = JSON.parse(user);

      switch (parsedUser.role) {
        case 'doctor':
          navigateTo('/doctor/dashboard');
          break;
        case 'patient':
          navigateTo('/patient/dashboard');
          break;
        case 'admin':
          navigateTo('/admin/dashboard');
          break;
        case 'clinic':
          navigateTo('/admin/appointments');
          break;
        default:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigateTo('/');
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.error === false) {
        setSuccess('Login successful! Redirecting...');

        localStorage.setItem('token', data.payload.token);
        localStorage.setItem('user', JSON.stringify(data.payload.user));

        const userRole = data.payload.user.role;

        setTimeout(() => {
          switch (userRole) {
            case 'patient':
              navigateTo('/patient/dashboard');
              break;
            case 'doctor':
              navigateTo('/doctor/dashboard');
              break;
            case 'admin':
              navigateTo('/admin/dashboard');
              break;
            case 'clinic':
              navigateTo('/admin/appointments');
              break;
            default:
              navigateTo('/dashboard');
          }
        }, 1000);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigateTo('/forget-password');
  };

  const handleRegister = () => {
    navigateTo('/signup');
  };

  return (
    <>
      {loading && <Loader />}
      <Header />
      <div className="min-h-[60vh] sm:min-h-screen flex items-center justify-center px-4">
        <div className="flex rounded-lg overflow-hidden w-full max-w-5xl">

          {/* Left Image */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
            <img src={loginbanner} alt="Login Visual" className="w-full h-auto" />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Login Painfx</h2>

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="w-full border border-gray-300 rounded px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={formData.password}
    onChange={handleInputChange}
    required
    disabled={loading}
  />

  {/* Eye Toggle Icon */}
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
  </button>
</div>

              <div
                className="text-right text-sm mb-3 text-blue-500 hover:underline cursor-pointer"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 cursor-pointer'
                } text-white`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <span
                  onClick={handleRegister}
                  className="text-green-600 hover:underline cursor-pointer"
                >
                  Register
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;