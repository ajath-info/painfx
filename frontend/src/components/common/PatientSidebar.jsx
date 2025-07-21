import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, UserCog, Lock, Menu, X } from "lucide-react";
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

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? "p-4" : "p-6"}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="text-center mb-8 pb-6 border-b border-gray-100">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-3 w-1/3 bg-gray-100 rounded" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-sm">{error}</div>
        ) : (
          <>
            <div className="relative inline-block">
              <img
                src={patientData.avatar}
                alt={patientData.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100 shadow-lg"
                onError={(e) => {
                  e.target.src = Stripe;
                }}
              />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{patientData.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {patientData.dob}
              {patientData.age ? `, ${patientData.age} years` : ""}
            </p>
            <p className="text-sm text-gray-500 px-2">{patientData.location}</p>
          </>
        )}
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleNavClick(item.name)}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-110 text-gray-400 group-hover:text-blue-600"
                }`}
              />
              <span className="font-medium">{item.name}</span>
              {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {showTriggerButton && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Patient Sidebar Mobile"
      >
        <SidebarContent isMobile />
      </aside>

      <aside
        className="hidden md:block w-80 h-full bg-white"
        role="navigation"
        aria-label="Patient Sidebar Desktop"
      >
        <SidebarContent />
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