import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between flex-wrap p-4 ml-4">

        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16" />
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center space-x-6 text-black">

          <span className="cursor-pointer hover:text-cyan-600 text-xl">Home</span>

          {/* Doctors Dropdown */}
          <div className="relative text-xl">
            <span onClick={() => toggleDropdown('doctors')} className="cursor-pointer hover:text-cyan-600 flex items-center">
              Doctors <i className="fas fa-chevron-down ml-1"></i>
            </span>
            {openDropdown === 'doctors' && (
              <ul className="absolute bg-white shadow-lg rounded mt-2 py-2 w-56 z-10">
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/dashboard">Doctor Dashboard</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/appointments">Appointments</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/patients">Patients List</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/schedule">Schedule Timing</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/patient-profile">Patients Profile</Link></li>
                {/* <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/chat">Chat</Link></li> */}
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/invoices">Invoices</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/profile-settings">Profile Settings</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/reviews">Reviews</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor/register">Doctor Register</Link></li>
              </ul>
            )}
          </div>

          {/* Patients Dropdown */}
          <div className="relative text-xl">
            <span onClick={() => toggleDropdown('patients')} className="cursor-pointer hover:text-cyan-600 flex items-center">
              Patients <i className="fas fa-chevron-down ml-1"></i>
            </span>
            {openDropdown === 'patients' && (
              <ul className="absolute bg-white shadow-lg rounded mt-2 py-2 w-56 z-10">
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/search-doctor">Search Doctor</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/doctor-profile">Doctor Profile</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/booking">Booking</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/checkout">Checkout</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/booking-success">Booking Success</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/patient/dashboard">Patient Dashboard</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/patient/favourites">Favourites</Link></li>
                {/* <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/patient/chat">Chat</Link></li> */}
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/patient/profile">Profile Settings</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/patient/change-password">Change Password</Link></li>
              </ul>
            )}
          </div>

          {/* Pages Dropdown */}
          <div className="relative text-xl">
            <span onClick={() => toggleDropdown('pages')} className="cursor-pointer hover:text-cyan-600 flex items-center">
              Pages <i className="fas fa-chevron-down ml-1"></i>
            </span>
            {openDropdown === 'pages' && (
              <ul className="absolute bg-white shadow-lg rounded mt-2 py-2 w-56 z-10">
                {/* <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/voice-call">Voice Call</Link></li> */}
                {/* <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/video-call">Video Call</Link></li> */}
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/calendar">Calendar</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/components">Components</Link></li>
                <li className="border-t my-2"></li>
                <li className="px-4 py-2 text-xs text-gray-500 uppercase">Invoices</li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/invoices">Invoice</Link></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/invoice-view">Invoice View</Link></li>
                <li className="border-t my-2"></li>
                <li><Link className="text-black block px-4 py-2 hover:bg-gray-100" to="/starter">Starter Page</Link></li>
              </ul>
            )}
          </div>
<span>
           <Link
            to="/admin/dashboard"
            className="cursor-pointer hover:text-cyan-600 text-xl"
          >
            Admin
          </Link>
          </span>
        </div>

        {/* Right Side Contact */}
        <div className="hidden lg:flex items-center space-x-6 mr-4">
          <div className="flex items-center space-x-2">
            <i className="far fa-hospital text-cyan-600 text-4xl"></i>
            <div className="flex flex-col ml-2">
              <p className="text-lg text-gray-500">Contact</p>
              <p className="text-lg font-semibold text-gray-700">+1 315 369 5943</p>
            </div>
          </div>

          <Link
            to="/login"
            className="border border-[#0078FD] text-[#0078FD] bg-white text-xl px-6 py-4 rounded hover:bg-[#0078FD] hover:text-white transition duration-300"
          >
            Login / Signup
          </Link>
        </div>

        {/* Mobile */}
        <div className="lg:hidden block">
          <button className="text-gray-700">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Header;
