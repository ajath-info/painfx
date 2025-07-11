import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo-white.JPG';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [user, setUser] = useState(null); // Simulated user state (replace with real auth)
  const [profileDropdown, setProfileDropdown] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setHoveredDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 200);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileDropdown(false);
  };

  return (
    <header className="bg-white shadow border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between flex-wrap py-3 px-3 lg:px-0">

        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-20 w-60 object-contain" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 text-gray-800 font-medium ml-6 text-[20px]">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>

          <Dropdown
            title="Doctors"
            name="doctors"
            hoveredDropdown={hoveredDropdown}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            links={[
              { to: "/doctor/dashboard", label: "Doctor Dashboard" },
              { to: "/doctor/appointments", label: "Appointments" },
              { to: "/doctor/patients", label: "Patients List" },
              { to: "/doctor/schedule", label: "Schedule Timing" },
              { to: "/doctor/patient-profile", label: "Patients Profile" },
              { to: "/doctor/invoices", label: "Invoices" },
              { to: "/doctor/profile-settings", label: "Profile Settings" },
              { to: "/doctor/reviews", label: "Reviews" },
              { to: "/doctor/register", label: "Doctor Register" },
            ]}
          />

          <Dropdown
            title="Patients"
            name="patients"
            hoveredDropdown={hoveredDropdown}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            links={[
              { to: "/search-doctor", label: "Search Doctor" },
              { to: "/doctor-profile", label: "Doctor Profile" },
              { to: "/booking", label: "Booking" },
              { to: "/checkout", label: "Checkout" },
              { to: "/booking-success", label: "Booking Success" },
              { to: "/patient/dashboard", label: "Patient Dashboard" },
              { to: "/patient/favourites", label: "Favourites" },
              { to: "/patient/chat", label: "Chat" },
              { to: "/patient/profile", label: "Profile Settings" },
              { to: "/patient/change-password", label: "Change Password" },
            ]}
          />

          <Dropdown
            title="Pages"
            name="pages"
            hoveredDropdown={hoveredDropdown}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            links={[
              { to: "/voice-call", label: "Voice Call" },
              { to: "/video-call", label: "Video Call" },
              { to: "/calendar", label: "Calendar" },
              { to: "/components", label: "Components" },
              { separator: true },
              { heading: "Invoices" },
              { to: "/invoices", label: "Invoice" },
              { to: "/invoice-view", label: "Invoice View" },
              { separator: true },
              { to: "/starter", label: "Starter Page" },
            ]}
          />

          <Link to="/admin/dashboard" className="hover:text-blue-600 transition">Admin</Link>
        </div>

        {/* Contact + User Section */}
        <div className="hidden lg:flex items-center space-x-8 ml-auto">
          <div className="flex items-center space-x-3">
            <i className="far fa-hospital text-blue-600 text-3xl"></i>
            <div className="flex flex-col leading-tight">
              <p className="text-[20px] text-gray-500">Contact</p>
              <p className="text-[20px] font-semibold text-gray-800">+1 315 369 5943</p>
            </div>
          </div>

          {/* User Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center border border-blue-500 text-blue-500 bg-white text-xl px-4 py-3.5 rounded-sm hover:bg-blue-500 hover:text-white transition duration-300"
              >
                <User className="mr-2" size={20} />
                Profile
              </button>

              {profileDropdown && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <li>
                    <Link
                      to="/patient/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-blue-500 text-blue-500 bg-white text-xl px-6 py-3.5 rounded-sm hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Login / Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden block ml-auto">
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

const Dropdown = ({ title, name, hoveredDropdown, handleMouseEnter, handleMouseLeave, links }) => (
  <div
    className="relative"
    onMouseEnter={() => handleMouseEnter(name)}
    onMouseLeave={handleMouseLeave}
  >
    <span className="cursor-pointer hover:text-blue-600 flex items-center">
      {title}
      <i className={`fas ml-2 ${hoveredDropdown === name ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
    </span>

    {hoveredDropdown === name && (
      <ul className="absolute bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-lg mt-3 py-3 w-60 z-20 border border-blue-100">
        {links.map((link, idx) => {
          if (link.separator) return <li key={idx} className="border-t border-blue-100 my-2"></li>;
          if (link.heading) return (
            <li key={idx} className="px-4 py-2 text-xs uppercase text-blue-500 font-semibold tracking-wide">
              {link.heading}
            </li>
          );
          return (
            <li key={idx}>
              <Link className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded transition" to={link.to}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default Header;