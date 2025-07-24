import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, UserCog, Lock, X } from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios";
import BASE_URL from "../../config";
import Stripe from "../../images/stripe.jpg"; // Default avatar fallback

const DEFAULT_PATIENT = {
  name: "Richard Wilson",
  dob: "24 Jul 1983",
  age: 38,
  location: "New York, USA",
  avatar: Stripe,
};

const PatientSidebar = ({
  patient,
  activeTab,
  setActiveTab = () => {},
  isSidebarOpen = false,
  setIsSidebarOpen = () => {},
  showTriggerButton = true,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [patientData, setPatientData] = useState(patient || DEFAULT_PATIENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setPatientData(DEFAULT_PATIENT);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/user/patient-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (data.status === 1 && data.payload?.patient) {
          const p = data.payload.patient;
          const dobMoment = p.DOB ? moment(p.DOB) : null;
          const age = dobMoment ? moment().diff(dobMoment, "years") : DEFAULT_PATIENT.age;

          setPatientData({
            name: `${p.prefix || ""} ${p.f_name || ""} ${p.l_name || ""}`.trim() || DEFAULT_PATIENT.name,
            dob: dobMoment ? dobMoment.format("DD MMM YYYY") : DEFAULT_PATIENT.dob,
            age,
            location: `${p.city || ""}${p.city && p.country ? ", " : ""}${p.country || ""}`.trim() || DEFAULT_PATIENT.location,
            avatar: p.profile_image || DEFAULT_PATIENT.avatar,
          });
          setError(null);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Failed to fetch patient profile:", err);
        setError("Failed to load patient profile. Using default data.");
        setPatientData(DEFAULT_PATIENT);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []);

  // Close sidebar when clicking outside or pressing escape
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("keydown", handleKeydown);
      // Prevent body scroll on mobile when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: User, path: "/patient/dashboard" },
    { name: "Favourites", icon: Calendar, path: "/patient/favourites" },
    { name: "Profile Settings", icon: UserCog, path: "/patient/profile-setting" },
    { name: "Change Password", icon: Lock, path: "/patient/change-password" },
  ];

  const handleNavClick = (name) => {
    setActiveTab(name);
    setIsSidebarOpen(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col bg-white ${isMobile ? "p-4" : "p-4 lg:p-6"}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Patient Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Patient Profile Section - Improved mobile layout */}
      <div className="text-center mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-gray-100">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center space-y-2 lg:space-y-3">
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gray-200" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-3 w-1/3 bg-gray-100 rounded" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-xs p-2 bg-red-50 rounded-lg">
            <p className="font-medium">Profile Error</p>
            <p className="mt-1 opacity-75">Using default data</p>
          </div>
        ) : (
          <>
            <div className="relative inline-block mb-2 lg:mb-3">
              <img
                src={patientData.avatar}
                alt={patientData.name}
                className="w-14 h-14 lg:w-20 lg:h-20 rounded-full mx-auto object-cover border-3 lg:border-4 border-blue-100 shadow-lg"
                onError={(e) => {
                  e.target.src = Stripe;
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <h3 className="font-bold text-sm lg:text-lg text-gray-900 mb-1 px-1">
              {patientData.name}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 mb-0.5">
              {patientData.dob}
              {patientData.age ? `, ${patientData.age} years` : ""}
            </p>
            <p className="text-xs lg:text-sm text-gray-500 px-1 truncate">
              {patientData.location}
            </p>
          </>
        )}
      </div>

      {/* Navigation Menu - Improved mobile spacing */}
      <nav className="space-y-1 lg:space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleNavClick(item.name)}
              className={`flex items-center p-2.5 lg:p-3 rounded-xl transition-all duration-200 group text-sm lg:text-base ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md active:bg-blue-100 active:scale-[0.98]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-4 h-4 lg:w-5 lg:h-5 mr-2.5 lg:mr-3 flex-shrink-0 transition-transform duration-200 ${
                  isActive 
                    ? "scale-110 text-white" 
                    : "text-gray-400 group-hover:text-blue-600 group-hover:scale-110"
                }`}
              />
              <span className="font-medium truncate flex-1">{item.name}</span>
              {isActive && (
                <div className="ml-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full flex-shrink-0 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer for mobile */}
      {isMobile && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">Patient Portal v1.0</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay - Improved animation */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Mobile Sidebar - Improved sizing and animation */}
      <div
        className={`fixed inset-y-0 left-0 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Patient navigation menu"
        aria-hidden={!isSidebarOpen}
      >
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar - Improved responsive sizing */}
      <aside
        className="hidden lg:block w-72 xl:w-80 h-full bg-white shadow-lg border-r border-gray-200"
        role="navigation"
        aria-label="Patient navigation menu"
      >
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
};

PatientSidebar.propTypes = {
  patient: PropTypes.object,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
  showTriggerButton: PropTypes.bool,
};

export default PatientSidebar;