import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Clock, FileText, Star, UserCog, LogOut, Menu, X } from 'lucide-react';

const DoctorSidebar = ({
  doctor,
  isSidebarOpen = false,
  setIsSidebarOpen = () => {},
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultDoctor = {
    name: 'Dr. Darren Elder',
    specialty: 'BDS, MDS - Oral Surgery',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  };

  const doctorData = doctor || defaultDoctor;

  const handleLogout = () => {
    setIsSidebarOpen(false);
    setMobileMenuOpen(false);
    // TODO: Add logout logic here
  };

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: <User className="w-5 h-5 mr-3" /> },
    // { label: 'Appointments', path: '/doctor/appointments', icon: <User className="w-5 h-5 mr-3" /> },
    { label: 'My Patients', path: '/doctor/patients', icon: <Users className="w-5 h-5 mr-3" /> },
    { label: 'Schedule Timings', path: '/doctor/schedule', icon: <Clock className="w-5 h-5 mr-3" /> },
    { label: 'Invoices', path: '/doctor/invoice', icon: <FileText className="w-5 h-5 mr-3" /> },
    { label: 'Reviews', path: '/doctor/reviews', icon: <Star className="w-5 h-5 mr-3" /> },
    { label: 'Profile Settings', path: '/doctor/profile-form', icon: <UserCog className="w-5 h-5 mr-3" /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Doctor Profile Section */}
      <div className="text-center mb-8 pb-6 border-b border-gray-100">
        <div className="relative inline-block">
          <img
            src={doctorData.avatar}
            alt={doctorData.name}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100 shadow-lg"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96?text=Avatar'; }}
          />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">{doctorData.name}</h3>
        <p className="text-sm text-gray-500 px-2">{doctorData.specialty}</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => {
                setIsSidebarOpen(false);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {link.icon}
              </div>
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        {/* <div className="pt-4 mt-4 border-t border-gray-100">
          <Link
            to="/"
            onClick={handleLogout}
            className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </Link>
        </div> */}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button (Fixed) */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-20 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full h-full bg-white">
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
};

export default DoctorSidebar;