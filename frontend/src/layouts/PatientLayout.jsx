import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Home, Menu, X } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PatientSidebar from '../components/common/PatientSidebar';

const PatientLayout = ({ 
  children, 
  patient, 
  activeTab, 
  setActiveTab 
}) => {
  const location = useLocation();
  
  // Manage sidebar state within the layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Default patient data
  const defaultPatient = {
    name: 'Richard Wilson',
    dob: '24 Jul 1983',
    age: 38,
    location: 'New York, USA',
    avatar: '/assets/images/patient-avatar.jpg',
  };

  const patientData = patient || defaultPatient;

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentPage = pathSegments[pathSegments.length - 1];
    
    // Convert kebab-case to title case
    const formatTitle = (str) => {
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const pageTitle = currentPage ? formatTitle(currentPage) : 'Dashboard';
    
    return {
      title: pageTitle,
      breadcrumb: `Home / Patient / ${pageTitle}`
    };
  };

  const { title } = getBreadcrumb();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header className="bg-white shadow-sm border-b border-gray-200 relative z-30" />

      {/* Breadcrumb Section - Improved mobile responsiveness */}
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

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Sidebar Component */}
        <PatientSidebar
          patient={patientData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showTriggerButton={false} // We handle the button in the breadcrumb now
        />

        {/* Main Content - Improved mobile layout */}
        <div className="h-[90vh] flex-1 overflow-auto lg:ml-0">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Content Header - Improved mobile spacing */}
              {/* <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-start sm:items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                      Manage your {title.toLowerCase()} information
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Content Body - Improved mobile padding */}
              <div className="p-4 sm:p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
};

export default PatientLayout;