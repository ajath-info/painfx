import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Calendar, UserCog, Lock, LogOut, X } from 'lucide-react';
import PropTypes from 'prop-types';
import Stripe  from "../../images/stripe.jpg";

const DEFAULT_PATIENT = {
  name: 'Richard Wilson',
  dob: '24 Jul 1983',
  age: 38,
  location: 'New York, USA',
};

const PatientSidebar = ({
  patient = DEFAULT_PATIENT,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const handleTabClick = (tabName) => {
    setActiveTab?.(tabName);
    setIsSidebarOpen?.(false);
  };

  const menuItems = [
    { name: 'Dashboard', icon: User, path: '/patient/dashboard' },
    { name: 'Favourites', icon: Calendar, path: '/patient/favourites' },
    { name: 'Profile Settings', icon: UserCog, path: '/patient/profile-setting' },
    { name: 'Change Password', icon: Lock, path: '/patient/change-password' },
    { name: 'Logout', icon: LogOut, path: '/' },
  ];

  return (
    <aside
      className={`
        fixed sm:static inset-y-0 w-80 left-0 bg-white shadow-lg border-r border-gray-200 
        transform sm:transform-none transition-transform duration-300 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        h-full
      `}
      role="navigation"
      aria-label="Patient Sidebar"
    >
      {/* Mobile Close Button */}
      <div className="sm:hidden flex justify-end p-4">
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Patient Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="text-center">
          <img
            src={Stripe}
            alt={`${patient.name}'s avatar`}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100"
            onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
          />
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{patient.name}</h3>
          <p className="text-sm text-gray-600 mb-1">
            {patient.dob}, {patient.age} years
          </p>
          <p className="text-sm text-gray-500">{patient.location}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleTabClick(item.name)}
              className={`
                flex items-center p-3 rounded-lg transition-colors duration-200 group
                ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

PatientSidebar.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string,
    dob: PropTypes.string,
    age: PropTypes.number,
    location: PropTypes.string,
    avatar: PropTypes.string,
  }),
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
};

export default PatientSidebar;