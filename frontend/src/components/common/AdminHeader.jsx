import React, { useState } from 'react';
import Logo from '../../images/logo-white.jpg';
import { FaAlignLeft, FaChevronDown } from 'react-icons/fa';
import avtarImage from  '../../images/avtarimage.webp'

  const IMAGE_BASE_URL = 'http://localhost:5000'

    // Helper function to format profile image URL
  const formatProfileImageUrl = (imageUrl) => {
    if (!imageUrl) return avtarImage;
    
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path from database, prepend BASE_URL
    return `${IMAGE_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

const AdminHeader = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { full_name = 'Admin User', email = 'admin@example.com', profile_image } = user;

  const defaultImage = 'https://rontomsongh.s3.ap-south-1.amazonaws.com/uploads/4ccd1ebf-c043-4a19-988e-48906329792b_IMG_0076_1080.jpeg';
  const profileImage = formatProfileImageUrl(profile_image);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <button
  onClick={toggleSidebar}
  className="text-gray-600 hover:text-gray-800 text-xl focus:outline-none lg:hidden"
>
  <FaAlignLeft />
</button>
        {/* Logo */}
      <div className="flex items-center">
  <img src={Logo} alt="Logo" className="h-14 w-60 object-contain sm:w-40 lg:w-60" />
</div>


        {/* Sidebar Toggle */}
      {/* Sidebar Toggle - hidden on large screens */}


      </div>

      {/* Right Section */}
      <div className="relative mt-3 sm:mt-0 flex items-center space-x-2">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <img
            src={profileImage}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <FaChevronDown className="text-gray-600 text-sm" />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-60 sm:w-64 bg-white shadow-lg rounded-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{full_name}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
