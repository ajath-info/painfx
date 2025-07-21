import React, { useState } from 'react';
import Logo from '../../images/logo-white.JPG';
import { FaAlignLeft, FaChevronDown } from 'react-icons/fa';

const AdminHeader = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Retrieve admin data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { full_name = 'Admin User', email = 'admin@example.com', profile_image } = user;

  // Fallback image if profile_image is not provided
  const defaultImage = 'https://picsum.photos/id/237/50/50';
  const profileImage = profile_image || defaultImage;

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex items-center justify-between">
      {/* Left Section: Logo, Gap, and Sidebar Toggle */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="w-32">
          <img src={Logo} alt="Logo" className="h-10 object-contain" />
        </div>
        {/* Sidebar Toggle */}
        <button
          className="text-gray-600 hover:text-gray-800 text-xl focus:outline-none transition-colors duration-200"
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>
      </div>

      {/* Right Section: User Profile with Dropdown */}
      <div className="flex items-center space-x-2 relative">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
          <img
            src={profileImage}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <FaChevronDown className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-lg py-2 z-10">
            {/* Admin Details */}
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800">{full_name}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminHeader;