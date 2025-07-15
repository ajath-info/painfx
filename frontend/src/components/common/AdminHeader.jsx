import React from 'react';
import Logo from '../../images/logo-white.JPG';
import { FaAlignLeft, FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';

const AdminHeader = ({ toggleSidebar }) => {
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

      {/* Center Section: Search Bar */}
      {/* <div className="flex-1 mx-4 hidden md:flex items-center bg-gray-100 rounded-full p-2 max-w-md">
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none w-full text-sm px-3 py-1 text-gray-700 placeholder-gray-500"
        />
        <FaSearch className="text-gray-500 mr-2" />
      </div> */}

      {/* Right Section: Notifications & User Profile */}
      <div className="flex items-center space-x-4">
        {/* <FaBell className="text-gray-600 hover:text-gray-800 cursor-pointer text-xl transition-colors duration-200" /> */}
        <div className="flex items-center space-x-2">
          <img
            src="https://picsum.photos/id/237/50/50"
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <FaChevronDown className="text-gray-600 hover:text-gray-800 cursor-pointer text-sm transition-colors duration-200" />
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;