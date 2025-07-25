import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../routes/AppRouter'; // Import useAuth from AppRouter
import { FaBars, FaHome, FaCalendar, FaUsers, FaUserMd, FaUser, FaStar, FaChartBar, FaUserCircle, FaLock, FaFile, FaTimes, FaHandshake, FaInfoCircle, FaClinicMedical } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { userRole } = useAuth(); // Get the user role from Auth context

  const isActive = (path) => location.pathname === path ? 'bg-cyan-400 rounded-md text-white' : 'text-white';

  const [openMenus, setOpenMenus] = useState({
    reports: false,
    authentication: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-btn')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  // Define allowed routes based on role
  const isClinicRole = userRole === 'clinic';
  const allowedRoutes = isClinicRole
    ? ['/admin/appointments', '/admin/specialities', '/admin/doctors', '/admin/patients', '/admin/reviews', '/admin/transactions']
    : [ // For admin or any other role, show all routes
      '/admin/dashboard', '/admin/appointments', '/admin/specialities', '/admin/doctors', 
      '/admin/patients', '/admin/reviews', '/admin/transactions', '/admin/reports', 
      '/admin/partner', '/admin/faqs', '/admin/clinic', '/admin/admin-profile', 
      '/admin/auth/register', '/admin/auth/forgot-password'
    ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed md:static top-0 left-0 h-full w-64 bg-[#1B5A90] text-white overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent scrollbar-thumb-rounded z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block`}
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

        {/* Mobile Header */}
        <div className="md:hidden bg-[#164a73] p-4 flex justify-between items-center border-b border-cyan-400/20">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-cyan-500/20 rounded-md transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          <ul className="space-y-2">
            <li className="text-gray-300 text-sm mb-4 font-medium">MAIN</li>

            {allowedRoutes.includes('/admin/dashboard') && (
              <SidebarLink 
                to="/admin/dashboard" 
                icon={<FaHome />} 
                label="Dashboard" 
                active={isActive('/admin/dashboard')} 
              />
            )}
             {allowedRoutes.includes('/admin/clinic') && (
              <SidebarLink 
                to="/admin/clinic" 
                icon={<FaClinicMedical />} 
                label="Clinic" 
                active={isActive('/admin/clinic')} 
              />
            )}
            {allowedRoutes.includes('/admin/appointments') && (
              <SidebarLink 
                to="/admin/appointments" 
                icon={<FaCalendar />} 
                label="Appointments" 
                active={isActive('/admin/appointments')} 
              />
            )}
            {allowedRoutes.includes('/admin/specialities') && (
              <SidebarLink 
                to="/admin/specialities" 
                icon={<FaUsers />} 
                label="Specialities" 
                active={isActive('/admin/specialities')} 
              />
            )}
            {allowedRoutes.includes('/admin/doctors') && (
              <SidebarLink 
                to="/admin/doctors" 
                icon={<FaUserMd />} 
                label="Doctors" 
                active={isActive('/admin/doctors')} 
              />
            )}
            {allowedRoutes.includes('/admin/patients') && (
              <SidebarLink 
                to="/admin/patients" 
                icon={<FaUser />} 
                label="Patients" 
                active={isActive('/admin/patients')} 
              />
            )}
            {allowedRoutes.includes('/admin/reviews') && (
              <SidebarLink 
                to="/admin/reviews" 
                icon={<FaStar />} 
                label="Reviews" 
                active={isActive('/admin/reviews')} 
              />
            )}
            {allowedRoutes.includes('/admin/transactions') && (
              <SidebarLink 
                to="/admin/transactions" 
                icon={<FaChartBar />} 
                label="Transactions" 
                active={isActive('/admin/transactions')} 
              />
            )}

            {allowedRoutes.includes('/admin/reports') && (
              <CollapsibleMenu 
                label="Reports" 
                icon={<FaFile />} 
                isOpen={openMenus.reports} 
                toggle={() => toggleMenu('reports')}
              >
                <SidebarLink 
                  to="/admin/reports" 
                  label="Invoice-Report" 
                  className="ml-6" 
                  active={isActive('/admin/reports')} 
                />
              </CollapsibleMenu>
            )}

            {allowedRoutes.includes('/admin/partner') && (
              <SidebarLink 
                to="/admin/partner" 
                icon={<FaHandshake />} 
                label="Partners" 
                active={isActive('/admin/partner')} 
              />
            )}
            {allowedRoutes.includes('/admin/faqs') && (
              <SidebarLink 
                to="/admin/faqs" 
                icon={<FaInfoCircle />} 
                label="FAQs" 
                active={isActive('/admin/faqs')} 
              />
            )}
            {/* {allowedRoutes.includes('/admin/clinic') && (
              <SidebarLink 
                to="/admin/clinic" 
                icon={<FaClinicMedical />} 
                label="Clinic" 
                active={isActive('/admin/clinic')} 
              />
            )} */}

            {!isClinicRole && ( // Conditionally render PAGES section only for non-clinic roles
              <>
                <li className="text-gray-300 text-sm mt-6 mb-4 font-medium">PAGES</li>

                {allowedRoutes.includes('/admin/admin-profile') && (
                  <SidebarLink 
                    to="/admin/admin-profile" 
                    icon={<FaUserCircle />} 
                    label="Profile" 
                    active={isActive('/admin/admin-profile')} 
                  />
                )}

                {allowedRoutes.includes('/admin/auth/register') && (
                  <CollapsibleMenu 
                    label="Authentication" 
                    icon={<FaLock />} 
                    isOpen={openMenus.authentication} 
                    toggle={() => toggleMenu('authentication')}
                  >
                    <SidebarLink 
                      to="/admin/auth/register" 
                      label="Register" 
                      className="ml-6" 
                      active={isActive('/admin/auth/register')} 
                    />
                    <SidebarLink 
                      to="/admin/auth/forgot-password" 
                      label="Forgot Password" 
                      className="ml-6" 
                      active={isActive('/admin/auth/forgot-password')} 
                    />
                  </CollapsibleMenu>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

// 🔹 Sidebar Link Component
const SidebarLink = ({ to, icon, label, active, className = '' }) => (
  <li className={`${active} ${className}`}>
    <Link
      to={to}
      className="flex items-center space-x-3 p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-200 group"
    >
      {icon && (
        <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
      )}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  </li>
);

// 🔹 Collapsible Menu Component
const CollapsibleMenu = ({ label, icon, isOpen, toggle, children }) => (
  <>
    <li 
      onClick={toggle} 
      className="flex items-center justify-between p-3 hover:bg-cyan-500/20 rounded-lg cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
        <IoIosArrowDown />
      </span>
    </li>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <ul className="space-y-1 pl-4 py-2">
        {children}
      </ul>
    </div>
  </>
);

export default AdminSidebar;