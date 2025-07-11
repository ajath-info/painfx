import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaDribbble,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../../images/white.png";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center lg:text-left">
        {/* Logo & Social */}
        <div>
          <img src={logo} alt="Logo" className="w-25 mx-auto lg:mx-0 mb-2" />
          <p className="text-base leading-relaxed mb-4 max-w-xs mx-auto lg:mx-0">
            2-34 Bunker Road, Victoria Point, QLD,4165 <br />
            22 Zenit St, Rochedale, QLD 4123 <br />
            48-50 Grevillea street Biloela 4715 <br />8 Charm street, PalmView,
            QLD 4553
          </p>
          <div className="flex justify-center lg:justify-start space-x-4 text-xl">
            <FaFacebookF className="hover:text-cyan-400 cursor-pointer" />
            <FaTwitter className="hover:text-cyan-400 cursor-pointer" />
            <FaLinkedinIn className="hover:text-cyan-400 cursor-pointer" />
            <FaInstagram className="hover:text-cyan-400 cursor-pointer" />
            <FaDribbble className="hover:text-cyan-400 cursor-pointer" />
          </div>
        </div>

        {/* For Patients */}
        <div>
          <h3 className="font-semibold text-xl mb-4">For Patients</h3>
          <ul className="space-y-3 text-base">
            <li className="hover:text-cyan-400 cursor-pointer">
              ›› Search for Doctors
            </li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Login</li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Register</li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Booking</li>
            <li className="hover:text-cyan-400 cursor-pointer">
              ›› Patient Dashboard
            </li>
          </ul>
        </div>

        {/* For Doctors */}
        <div>
          <h3 className="font-semibold text-xl mb-4">For Doctors</h3>
          <ul className="space-y-3 text-base">
            <li className="hover:text-cyan-400 cursor-pointer">
              ›› Search for Doctors
            </li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Login</li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Register</li>
            <li className="hover:text-cyan-400 cursor-pointer">›› Booking</li>
            <li className="hover:text-cyan-400 cursor-pointer">
              ›› Patient Dashboard
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Contact Us</h3>
          <ul className="space-y-4 text-base max-w-xs mx-auto lg:mx-0">
            <li className="flex items-start justify-center lg:justify-start space-x-3">
              <FaMapMarkerAlt className="mt-1 text-lg" />
              <span>
                3556 Beech Street, San Francisco, California, CA 94108
              </span>
            </li>
            <li className="flex items-center justify-center lg:justify-start space-x-3">
              <FaPhoneAlt className="text-lg" />
              <span>+1 315 369 5943</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start space-x-3">
              <FaEnvelope className="text-lg" />
              <span>painfx@example.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-blue-800 mt-10 pt-6 text-sm text-center text-gray-300">
        © {new Date().getFullYear()} PainFX. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;