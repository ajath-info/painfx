import React from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const AdminLayout = ({ children }) => (
  <div className="main-wrapper">
    <Header />
    <Sidebar />
    <div className="page-wrapper">
      <div className="content container-fluid">
        {children}
      </div>
    </div>
    <Footer />
  </div>
);

export default AdminLayout;
