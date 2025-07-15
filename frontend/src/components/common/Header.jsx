import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo-white.JPG';

const Header = () => {
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
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

  const toggleMobileDropdown = (menu) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const Dropdown = ({ title, name, links }) => (
    <div
      className="relative"
      onMouseEnter={() => handleMouseEnter(name)}
      onMouseLeave={handleMouseLeave}
    >
      <span className="cursor-pointer hover:text-blue-600 flex items-center">
        {title}
        <i className={`fas ml-2 ${hoveredDropdown === name ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
      </span>

      {hoveredDropdown === name && (
        <ul className="absolute bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-lg mt-3 py-3 w-60 z-20 border border-blue-100">
          {links.map((link, idx) => {
            if (link.separator) return <li key={idx} className="border-t border-blue-100 my-2" />;
            if (link.heading)
              return (
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

  const MobileDropdown = ({ title, name, links }) => (
    <div>
      <button
        onClick={() => toggleMobileDropdown(name)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-blue-100"
      >
        {title}
        <i className={`fas ${mobileDropdowns[name] ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
      </button>
      {mobileDropdowns[name] && (
        <ul className="pl-4 bg-blue-50">
          {links.map((link, idx) => {
            if (link.separator) return <li key={idx} className="border-t border-blue-100 my-2" />;
            if (link.heading)
              return (
                <li key={idx} className="px-4 py-2 text-xs uppercase text-blue-500 font-semibold tracking-wide">
                  {link.heading}
                </li>
              );
            return (
              <li key={idx}>
                <Link
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const doctorsLinks = [
    { to: "/doctor/dashboard", label: "Doctor Dashboard" },
    { to: "/doctor/appointments", label: "Appointments" },
    { to: "/doctor/patients", label: "Patients List" },
    { to: "/doctor/schedule", label: "Schedule Timing" },
  ];

  const patientsLinks = [
    { to: "/search-doctor", label: "Search Doctor" },
    { to: "/doctor-profile", label: "Doctor Profile" },
    { to: "/booking", label: "Booking" },
    // { to: "/checkout", label: "Checkout" },
    // { to: "/booking-success", label: "Booking Success" },
    { to: "/patient/dashboard", label: "Patient Dashboard" },
    // { to: "/patient/favourites", label: "Favourites" },
    // { to: "/patient/chat", label: "Chat" },
    { to: "/patient/profile", label: "Profile Settings" },
    // { to: "/patient/change-password", label: "Change Password" },
  ];

  const pagesLinks = [
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
  ];

  return (
    <header className="bg-white shadow border-b border-gray-200">
      <nav className=" ml-8 mr-8 mx-auto flex items-center justify-between flex-wrap py-4 px-4 lg:px-0">

        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-25 w-60" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 font-medium text-gray-800 text-[18px]">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Dropdown title="Doctors" name="doctors" links={doctorsLinks} />
          <Dropdown title="Patients" name="patients" links={patientsLinks} />
          {/* <Dropdown title="Pages" name="pages" links={pagesLinks} /> */}
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition">Admin</Link>
        </div>

        {/* Contact & Login - Desktop */}
        <div className="hidden lg:flex items-center space-x-8 ml-auto">
          <div className="flex items-center space-x-3">
            <i className="far fa-hospital text-blue-600 text-3xl"></i>
            <div className="flex flex-col leading-tight">
              <p className="text-[18px] text-gray-500">Contact</p>
              <p className="text-[18px] font-semibold text-gray-800">+1 315 369 5943</p>
            </div>
          </div>
          <Link
            to="/login"
            className="border border-blue-500 text-blue-500 bg-white px-5 py-4 rounded hover:bg-blue-500 hover:text-white transition text-[18px] font-semibold"
          >
            Login / Signup
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
     <button
  className="lg:hidden bg-[#0078FD] text-white p-2 rounded-md shadow-lg hover:bg-[#0066d1] transition"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <i class="fa-solid fa-bars text-2xl w-6"></i>
</button>



      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 lg:hidden">
          <div className="py-3 flex flex-col text-gray-800 text-[17px] font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-blue-50">Home</Link>
            <MobileDropdown title="Doctors" name="doctors" links={doctorsLinks} />
            <MobileDropdown title="Patients" name="patients" links={patientsLinks} />
            <MobileDropdown title="Pages" name="pages" links={pagesLinks} />
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-blue-50">Admin</Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-4 py-3 text-blue-600 border-t border-gray-100 hover:bg-blue-50"
            >
              Login / Signup
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;