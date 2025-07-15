import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import DoctorSidebar from '../components/doctor/DoctorSideBar';

const DoctorLayout = ({ children, setActiveView, activeView }) => {
  const location = useLocation();

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
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <Header />

      {/* Page Title Section */}
      <div className="bg-[#0078FD] text-white px-4 py-6">
        <h3 className="text-sm md:text-base">{breadcrumb}</h3>
        <h1 className="text-xl md:text-3xl font-semibold">{title}</h1>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col md:flex-row bg-gray-100">

        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-gray-200">
          <DoctorSidebar setActiveView={setActiveView} activeView={activeView} />
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