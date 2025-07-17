import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaDribbble,
} from "react-icons/fa";
import Footerlogo from "../../images/footerlogo.png";
import stripeLogo from "../../images/stripe.jpg";
import gdprLogo from "../../images/gdpr.jpg";

const Footer = () => {
  return (
    <footer className="bg-[#0078FD] text-white pt-16 pb-8 px-[10px]">
      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center lg:text-left">
        {/* Logo & Social */}
        <div>
          <img
            src={Footerlogo}
            alt="PainFX Logo"
            className="w-32 mx-auto lg:mx-0 mb-6"
          />
          <p className="text-sm leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
            2-34 Bunker Road, Victoria Point, QLD 4165<br />
            22 Zenit St, Rochedale, QLD 4123<br />
            48-50 Grevillea Street, Biloela, QLD 4715<br />
            8 Charm Street, PalmView, QLD 4553
          </p>
          <div className="flex justify-center lg:justify-start space-x-4 text-xl">
            <FaFacebookF className="hover:text-cyan-300 cursor-pointer transition" />
            <FaTwitter className="hover:text-cyan-300 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-cyan-300 cursor-pointer transition" />
            <FaInstagram className="hover:text-cyan-300 cursor-pointer transition" />
            <FaDribbble className="hover:text-cyan-300 cursor-pointer transition" />
          </div>
        </div>

        {/* For Patients */}
        <div>
          <h3 className="font-bold text-xl mb-6">For Patients</h3>
          <ul className="space-y-4 text-base">
            <li>
              <Link to="/doctor/appointments" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Search for Doctors
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Register
              </Link>
            </li>
            <li>
              <Link to="/patient/dashboard" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Patient Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* For Doctors */}
        <div>
          <h3 className="font-bold text-xl mb-6">For Doctors</h3>
          <ul className="space-y-4 text-base">
            <li>
              <Link to="/doctor/appointments" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Appointment
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Register
              </Link>
            </li>
            <li>
              <Link to="/doctor/dashboard" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> Doctor Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Compliance Section */}
        <div>
          <h3 className="font-bold text-xl mb-6">Compliance</h3>
          <ul className="space-y-4 text-base">
             <Link to="/doctor/dashboard" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> GDPR Compliant
              </Link>
              <Link to="/faqs" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> FAQs
              </Link>
               <Link to="/doctor/dashboard" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> HIPAA Compliant
              </Link>
               <Link to="/doctor/dashboard" className="hover:text-cyan-300 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fa-solid fa-angles-right"></i> PCI DSS Certified
              </Link>
            
          </ul>
          <div className="flex justify-center lg:justify-start space-x-4 mt-6">
            <img src={gdprLogo} alt="GDPR" className="h-10 w-auto" />
            <img src={stripeLogo} alt="Stripe" className="h-10 w-auto" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-blue-800 mt-14 pt-6 text-sm text-center text-gray-300">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold">PainFX</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;