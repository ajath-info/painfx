import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X ,ChevronRight,Home} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import DoctorSidebar from '../components/doctor/DoctorSideBar';

const DoctorLayout = ({ children, setActiveView, activeView }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map each route path to breadcrumb and title
  const pathMap = {
    '/doctor/dashboard': { breadcrumb: 'Home / Dashboard', title: 'Dashboard' },
    '/doctor/patients': { breadcrumb: 'Home / My Patients', title: 'My Patients' },
    '/doctor/schedule': { breadcrumb: 'Home / Schedule Timings', title: 'Schedule Timings' },
    '/doctor/invoice': { breadcrumb: 'Home / Invoices', title: 'Invoices' },
    '/doctor/reviews': { breadcrumb: 'Home / Reviews', title: 'Reviews' },
    '/doctor/profile-form': { breadcrumb: 'Home / Profile Settings', title: 'Profile Settings' },
  };

  const { breadcrumb, title } = pathMap[location.pathname] || { breadcrumb: 'Home', title: '' };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header className="bg-white shadow-sm border-b border-gray-200 relative z-30" />

      {/* Breadcrumb Section with Toggle Button */}
     <div className="bg-cyan-500 shadow-lg relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Side: Breadcrumb */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb navigation - hidden on very small screens */}
              <nav className="hidden xs:flex items-center space-x-1 sm:space-x-2 text-blue-100 text-xs sm:text-sm mb-1">
                <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Home</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Patient</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-white font-medium truncate">{title}</span>
              </nav>
              
              {/* Title - responsive sizing */}
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {title}
              </h1>
            </div>

            {/* Right Side: Mobile Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden ml-3 bg-cyan-500 text-white p-2 sm:p-2.5 rounded-lg shadow-md hover:bg-blue-800 active:bg-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label={isSidebarOpen ? "Close patient menu" : "Open patient menu"}
              type="button"
            >
              {isSidebarOpen ? 
                <X className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col md:flex-row bg-gray-100 relative">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 z-50 md:relative">
          <DoctorSidebar
            setActiveView={setActiveView}
            activeView={activeView}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </aside>

        {/* Main Content */}
        <main className="h-screen flex-1 p-4 overflow-y-auto">
          <div className="max-w-full">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DoctorLayout;
