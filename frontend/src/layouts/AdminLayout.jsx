import React, { useState } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader toggleSidebar={toggleSidebar} />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Container */}
          <main className="flex-1 overflow-auto bg-gray-50 pt-16 md:pt-0">
            <div className="p-4 sm:p-6 lg:p-8 min-h-full">
              <div className="max-w-full">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;