import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaDribbble,
} from "react-icons/fa";
import Footerlogo from "../../images/footerlogo.webp";
import stripeLogo from "../../images/stripe.webp";
import gdprLogo from "../../images/gdpr.webp";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setIsLoggedIn(true);
        setUserRole(user.role);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  // Protected link handler
  const handleProtectedLink = (e, targetPath, requiredRole = null) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Show alert or redirect if user doesn't have required role
      alert(`Access denied. This section is only for ${requiredRole}s.`);
      return;
    }

    // Navigate to the target path if authenticated and authorized
    navigate(targetPath);
  };

  return (
    <footer className="bg-[#666] text-white pt-16 pb-8 px-[10px]">
      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:text-left">
        {/* Logo & Social */}
        <div>
          <img
            src={Footerlogo}
            alt="PainFX Logo"
            className="w-25 h-25 mx-auto lg:mx-0 mb-6"
          />
          <p className="text-sm leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
            We acknowledge Aboriginal and Torres Strait Islander peoples as the
            First Australians and Traditional Custodians of the lands where we
            live, learn and work.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4 text-xl">
            <FaFacebookF className="hover:text-cyan-300 cursor-pointer transition" />
            <FaTwitter className="hover:text-cyan-300 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-cyan-300 cursor-pointer transition" />
            <FaInstagram className="hover:text-cyan-300 cursor-pointer transition" />
          </div>
        </div>

        {/* For Patients */}
        <div className="mt-30 sm:mt-0">
          <h3 className="font-bold text-xl mb-6">For Patients</h3>
          <ul className="space-y-4 text-base">
            <li>
              <Link
                to="/"
                className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
              >
                <i className="fa-solid fa-angles-right"></i> Search for Doctors
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
                  >
                    <i className="fa-solid fa-angles-right"></i> Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
                  >
                    <i className="fa-solid fa-angles-right"></i> Register
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <a
                href="#"
                onClick={(e) =>
                  handleProtectedLink(e, "/patient/dashboard", "patient")
                }
                className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-pointer"
              >
                <i className="fa-solid fa-angles-right"></i> Patient Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* For Doctors */}
        <div>
          <h3 className="font-bold text-xl mb-6">For Doctors</h3>
          <ul className="space-y-4 text-base">
            <li>
              <a
                href="#"
                onClick={(e) =>
                  handleProtectedLink(e, "/doctor/appointments", "doctor")
                }
                className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-pointer"
              >
                <i className="fa-solid fa-angles-right"></i> Appointment
              </a>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
                  >
                    <i className="fa-solid fa-angles-right"></i> Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
                  >
                    <i className="fa-solid fa-angles-right"></i> Register
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <a
                href="#"
                onClick={(e) =>
                  handleProtectedLink(e, "/doctor/dashboard", "doctor")
                }
                className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-pointer"
              >
                <i className="fa-solid fa-angles-right"></i> Doctor Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* Compliance Section */}
        <div>
          <h3 className="font-bold text-xl mb-6 lg:justify-start">
            Compliance
          </h3>
          <ul className="space-y-4 text-base">
            <li>
              <span className=" hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-default">
                <i className="fa-solid fa-angles-right"></i> <a href="/Disclaimer">Disclaimer</a>
              </span>
            </li>

            <li>
              <span className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-default">
                <i className="fa-solid fa-angles-right"></i> <a href="/cancellations">Cancellation</a>
              </span>
            </li>
            <li>
              <Link
                to="/faqs"
                className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start"
              >
                <i className="fa-solid fa-angles-right"></i> FAQs
              </Link>
            </li>
            <li>
              <span className="hover:text-cyan-300 flex items-center gap-2 lg:justify-start cursor-default">
                <i className="fa-solid fa-angles-right"></i> PCI DSS Certified
              </span>
            </li>
          </ul>
          <div className="flex lg:justify-start space-x-4 mt-6">
            <img src={gdprLogo} alt="GDPR" className="h-10 w-auto" />
            <img src={stripeLogo} alt="Stripe" className="h-10 w-auto" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white mt-14 pt-6 text-sm text-white">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center px-2">
          <div>
            <h4 className="font-semibold">NDIS #: 0126584567</h4>
          </div>
          <div>
            <h4 className="font-semibold">ABN #: 781 432 275 34</h4>
          </div>
          <div>
            <h4 className="font-semibold">License #: XXXXXXXX</h4>
          </div>
          <div>
            <h4 className="font-semibold">
              <a href="/terms-and-conditions" className="hover:text-cyan-300">Terms and Conditions | </a>
              <a href="/Privacy-Policy" className="hover:text-cyan-300">| Privacy Policy</a>
            </h4>
          </div>
        </div>

        <div className="mt-6 text-center pt-4 border-t border-white">
          <div>
            <h4 className="font-semibold mb-2">
              Powered and Managed by Digitallifestream
            </h4>
          </div>
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">PainFX</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
