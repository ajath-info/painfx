import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHome, FaCalendar, FaUsers, FaUserMd, FaUser, FaStar, FaChartBar, FaCogs, FaUserCircle, FaLock, FaFile, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

const AdminSidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'bg-cyan-400 rounded-md text-white' : 'text-white';

  const [openMenus, setOpenMenus] = useState({
    reports: false,
    authentication: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-[#1B5A90] p-3 flex justify-between items-center text-white fixed top-0 w-full z-50">
        <h2 className="font-bold">Admin</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-screen w-64 bg-[#1B5A90] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent scrollbar-thumb-rounded ${sidebarOpen ? 'block' : 'hidden'} md:block sticky top-16`}
      >
        <style>
          {`
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(34, 211, 238, 0.4);
              border-radius: 4px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(34, 211, 238, 0.7);
            }
          `}
        </style>
        <ul className="space-y-2 pt-16">
          <li className="text-gray-300 text-sm mb-2">Main</li>

          <SidebarLink to="/admin/dashboard" icon={<FaHome />} label="Dashboard" active={isActive('/admin/dashboard')} />
          <SidebarLink to="/admin/appointments" icon={<FaCalendar />} label="Appointments" active={isActive('/admin/appointments')} />
          <SidebarLink to="/admin/specialities" icon={<FaUsers />} label="Specialities" active={isActive('/admin/specialities')} />
          <SidebarLink to="/admin/doctors" icon={<FaUserMd />} label="Doctors" active={isActive('/admin/doctors')} />
          <SidebarLink to="/admin/patients" icon={<FaUser />} label="Patients" active={isActive('/admin/patients')} />
          <SidebarLink to="/admin/reviews" icon={<FaStar />} label="Reviews" active={isActive('/admin/reviews')} />
          <SidebarLink to="/admin/transactions" icon={<FaChartBar />} label="Transactions" active={isActive('/admin/transactions')} />
          <SidebarLink to="/admin/settings" icon={<FaCogs />} label="Settings" active={isActive('/admin/settings')} />

          <CollapsibleMenu label="Reports" icon={<FaFile />} isOpen={openMenus.reports} toggle={() => toggleMenu('reports')}>
            <SidebarLink to="/admin/reports" label="Invoice-Report" className="ml-8" active={isActive('/admin/reports')} />
          </CollapsibleMenu>

          <li className="text-gray-300 text-sm mt-4 mb-2">Pages</li>

          <SidebarLink to="/admin/admin-profile" icon={<FaUserCircle />} label="Profile" active={isActive('/admin/admin-profile')} />

          <CollapsibleMenu label="Authentication" icon={<FaLock />} isOpen={openMenus.authentication} toggle={() => toggleMenu('authentication')}>
            <SidebarLink to="/admin/auth/login" label="Login" className="ml-8" active={isActive('/admin/auth/login')} />
            <SidebarLink to="/admin/auth/register" label="Register" className="ml-8" active={isActive('/admin/auth/register')} />
            <SidebarLink to="/admin/auth/forgot-password" label="Forgot Password" className="ml-8" active={isActive('/admin/auth/forgot-password')} />
          </CollapsibleMenu>
        </ul>
      </div>
    </>
  );
};

// 🔹 Sidebar Link Component
const SidebarLink = ({ to, icon, label, active, className = '' }) => (
  <li className={`${active} ${className}`}>
    <Link
      to={to}
      className="flex items-center space-x-2 p-2 hover:bg-cyan-500 rounded-md transition-colors duration-200"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </Link>
  </li>
);

// 🔹 Collapsible Menu Component
const CollapsibleMenu = ({ label, icon, isOpen, toggle, children }) => (
  <>
    <li onClick={toggle} className="flex items-center justify-between p-2 hover:bg-cyan-500 rounded-md cursor-pointer transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
      {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
    </li>
    {isOpen && (
      <ul className="space-y-1 pl-4 transition-all duration-300 ease-in-out">
        {children}
      </ul>
    )}
  </>
);

export default AdminSidebar;