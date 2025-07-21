import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaUser, FaCalendar, FaUsers, FaStar, FaLock,FaFileInvoice,FaKey } from 'react-icons/fa';

const ClinicSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-cyan-500 text-white' : 'text-gray-200 hover:bg-cyan-600';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-72 bg-[#1B5A90] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent transition-transform duration-300 ease-in-out z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-full md:block`}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="font-bold text-lg">Menu</h2>
          <button 
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <ul className="space-y-2 pt-4">
          <li className="text-gray-300 text-sm mb-2">Main</li>
          <SidebarLink to="/clinic/dashboard" icon={<FaUser />} label="Dashboard" active={isActive('/clinic/dashboard')} />
          <SidebarLink to="/clinic/appointment" icon={<FaCalendar />} label="Appointments" active={isActive('/clinic/appointment')} />
          <SidebarLink to="/clinic/doctor" icon={<FaUsers />} label="Doctors" active={isActive('/clinic/doctor')} />
          <SidebarLink to="/clinic/speciality" icon={<FaStar />} label="Specialities" active={isActive('/clinic/speciality')} />
          <SidebarLink to="/clinic/invoice" icon={<FaFileInvoice />} label="Invoices" active={isActive('/clinic/invoice')} />
          <SidebarLink to="/clinic/ChangePassword" icon={<FaKey />} label="Change Password" active={isActive('/clinic/ChangePassword')} />


          <hr className="my-4 border-gray-500" />
          <SidebarLink to="/" icon={<FaLock />} label="Logout" active={isActive('/')} />
        </ul>
      </div>
    </>
  );
};

// Sidebar Link Component
const SidebarLink = ({ to, icon, label, active }) => (
  <li className={`rounded-md ${active}`}>
    <Link
      to={to}
      className="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </Link>
  </li>
);

export default ClinicSidebar;