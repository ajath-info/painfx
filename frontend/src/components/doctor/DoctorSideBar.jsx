import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Clock, FileText, Star, UserCog, LogOut } from 'lucide-react';

const DoctorSidebar = ({
  doctor,
  activeView = '',
  setActiveView = () => {},
  isSidebarOpen = false,
  setIsSidebarOpen = () => {},
}) => {
  const defaultDoctor = {
    name: 'Dr. Darren Elder',
    specialty: 'BDS, MDS - Oral Surgery',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  };

  const doctorData = doctor || defaultDoctor;

  const handleViewClick = (viewName) => {
    setActiveView(viewName);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    // TODO: Add logout logic (e.g., clear localStorage, redirect to login)
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'h-full' : ''} flex flex-col`}>
      <div className="text-center mb-6">
        <img
          src={doctorData.avatar}
          alt={doctorData.name}
          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/96x96?text=Avatar';
          }}
        />
        <h3 className="font-semibold text-lg text-gray-900">{doctorData.name}</h3>
        <p className="text-sm text-gray-500">{doctorData.specialty}</p>
      </div>

      <nav className="space-y-2 flex-1">
        <Link
          to="/doctor/dashboard"
          onClick={() => handleViewClick('Dashboard')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'Dashboard' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <User className="w-5 h-5 mr-2" /> Dashboard
        </Link>

        <Link
          to="/doctor/patients"
          onClick={() => handleViewClick('MyPatients')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'MyPatients' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <Users className="w-5 h-5 mr-2" /> My Patients
        </Link>

        <Link
          to="/doctor/schedule"
          onClick={() => handleViewClick('ScheduleTimings')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'ScheduleTimings' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <Clock className="w-5 h-5 mr-2" /> Schedule Timings
        </Link>

        <Link
          to="/doctor/invoice"
          onClick={() => handleViewClick('Invoice')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'Invoice' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <FileText className="w-5 h-5 mr-2" /> Invoices
        </Link>

        <Link
          to="/doctor/reviews"
          onClick={() => handleViewClick('Reviews')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'Reviews' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <Star className="w-5 h-5 mr-2" /> Reviews
        </Link>

        <Link
          to="/doctor/profile-form"
          onClick={() => handleViewClick('ProfileSettings')}
          className={`flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            activeView === 'ProfileSettings' ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <UserCog className="w-5 h-5 mr-2" /> Profile Settings
        </Link>

        <Link
          to="/"
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Link>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 bg-white shadow-sm border-r border-gray-200 p-4 min-h-screen">
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
};

export default DoctorSidebar;