import React from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';

const AdminLayout = ({ children }) => (
  <div className="flex flex-col h-screen">
    {/* Navbar at the top */}
    <AdminHeader />

    {/* Main content area with sidebar and children */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar on the left */}
      <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
        <AdminSidebar/>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AdminLayout;