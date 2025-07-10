import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaDribbble, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
  return (
   <footer className="bg-blue-900 text-white py-12">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

    {/* Logo & Social */}
    <div className="text-center md:text-left">
      <img
       className="w-40 mb-6" src={logo} alt="Logo" />
      <p className="text-lg mb-6 leading-relaxed max-w-xs mx-auto md:mx-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div className="flex justify-center md:justify-start space-x-4 text-2xl">
        <FaFacebookF className="hover:text-cyan-400 cursor-pointer" />
        <FaTwitter className="hover:text-cyan-400 cursor-pointer" />
        <FaLinkedinIn className="hover:text-cyan-400 cursor-pointer" />
        <FaInstagram className="hover:text-cyan-400 cursor-pointer" />
        <FaDribbble className="hover:text-cyan-400 cursor-pointer" />
      </div>
    </div>

    {/* For Patients */}
    <div>
      <h3 className="font-semibold mb-5 text-2xl">For Patients</h3>
      <ul className="space-y-3 text-lg">
        <li className="hover:text-cyan-400 cursor-pointer">› Search for Doctors</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Login</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Register</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Booking</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Patient Dashboard</li>
      </ul>
    </div>

    {/* For Doctors */}
    <div>
      <h3 className="font-semibold mb-5 text-2xl">For Doctors</h3>
      <ul className="space-y-3 text-lg">
        <li className="hover:text-cyan-400 cursor-pointer">› Search for Doctors</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Login</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Register</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Booking</li>
        <li className="hover:text-cyan-400 cursor-pointer">› Patient Dashboard</li>
      </ul>
    </div>

    {/* Contact Us */}
    <div>
      <h3 className="font-semibold mb-5 text-2xl">Contact Us</h3>
      <ul className="space-y-4 text-base">
        <li className="flex items-start space-x-3">
          <FaMapMarkerAlt className="mt-1" />
          <span>3556 Beech Street, San Francisco, California, CA 94108</span>
        </li>
        <li className="flex items-center space-x-3">
          <FaPhoneAlt />
          <span>+1 315 369 5943</span>
        </li>
        <li className="flex items-center space-x-3">
          <FaEnvelope />
          <span>painfx@example.com</span>
        </li>
      </ul>
    </div>

  </div>
</footer>

  );
};

export default Footer;
