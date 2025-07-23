import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Home,Menu, X } from 'lucide-react';
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

      {/* Breadcrumb Section */}
<div className="bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg relative">
  <div className="absolute inset-0 bg-black opacity-10"></div>
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    {/* Left Side: Breadcrumb */}
    <div>
      <nav className="flex items-center space-x-2 text-blue-100 text-sm mb-1">
        <Home className="w-4 h-4" />
        <span>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span>Patient</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">{title}</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
    </div>

    {/* Right Side: Mobile Toggle Button */}
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="sm:hidden bg-blue-700 text-white p-2 rounded-lg shadow-md hover:bg-blue-800 transition"
      aria-label={isSidebarOpen ? "Close patient menu" : "Open patient menu"}
      type="button"
    >
      {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  </div>
</div>


      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Single Sidebar Component - Works for all screen sizes */}
        <PatientSidebar
          patient={patientData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showTriggerButton={true}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto sm:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Content Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your {title.toLowerCase()} information
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
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