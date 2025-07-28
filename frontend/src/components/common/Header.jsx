import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/logo-white.webp';
import avtarImage from  '../../images/avtarimage.webp'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [user, setUser] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    navigate('/login');
    console.log('User logged out successfully');
  };

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

  const handleProtectedLinkClick = (to) => {
    if (!isLoggedIn) {
      navigate('/login');
      setMobileMenuOpen(false);
      return;
    }
    navigate(to);
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
                <Link
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded transition"
                  to={isLoggedIn ? link.to : '#'}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      handleProtectedLinkClick(link.to);
                    }
                  }}
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
                  to={isLoggedIn ? link.to : '#'}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      handleProtectedLinkClick(link.to);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
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
    { to: '/doctor/dashboard', label: 'Doctor Dashboard' },
    { to: '/doctor/appointments', label: 'Appointments'},
    { to: '/doctor/schedule', label: 'Schedule Timing' },
  ];

  const patientsLinks = [
    // { to: '/patient/booking', label: 'Booking' },
    // { to: '/patient/book-appointment', label: 'Checkout' },
    { to: '/patient/dashboard', label: 'Patient Dashboard' },
    // { to: '/patient/profile-setting', label: 'Profile Settings' },
  ];

  return (
    <header className="bg-white shadow border-b border-gray-200">
     <nav className="mx-4 lg:mx-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center ">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-25 w-60" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 font-medium text-gray-800 text-[18px]">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          {(!isLoggedIn || user?.role === 'doctor') && (
            <Dropdown title="Doctors" name="doctors" links={doctorsLinks} />
          )}
          {(!isLoggedIn || user?.role === 'patient') && (
            <Dropdown title="Patients" name="patients" links={patientsLinks} />
          )}
        </div>

        {isLoggedIn ? (
          <div className="hidden lg:flex items-center space-x-8 ml-auto">
            {/* User Menu Dropdown */}
            <div className="relative group ">
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
                <img
                  // src={user?.profile_image || '/default-user.png'}
               src={formatProfileImageUrl(user?.profile_image)}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={formatProfileImageUrl(user?.profile_image)}
                      alt="Image"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h6 className="font-semibold text-gray-800">{user?.full_name || 'User'}</h6>
                      <p className="text-sm text-gray-500 mb-0">{user?.role || 'Role'}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    to={user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={user?.role === 'doctor' ? '/doctor-profile-settings' : '/patient/profile-setting'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer block px-4 py-2 text-gray-700 hover:bg-gray-100 transition w-full text-left"
                  >
                    LogOut
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden bg-[#0078FD] text-white p-2 rounded-md shadow-lg hover:bg-[#0066d1] transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className="fa-solid fa-bars text-2xl w-6"></i>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 lg:hidden">
          <div className="py-3 flex flex-col text-gray-800 text-[17px] font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-blue-50">
              Home
            </Link>
            {(!isLoggedIn || user?.role === 'doctor') && (
              <MobileDropdown title="Doctors" name="doctors" links={doctorsLinks} />
            )}
            {(!isLoggedIn || user?.role === 'patient') && (
              <MobileDropdown title="Patients" name="patients" links={patientsLinks} />
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to={user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <Link
                  to={user?.role === 'doctor' ? '/doctor-profile-settings' : '/patient/profile-setting'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 hover:bg-blue-50"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-blue-600 border-t border-gray-100 hover:bg-blue-50 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-blue-600 border-t border-gray-100 hover:bg-blue-50"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;