import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
// import BlueHeading from '../components/doctor/BlueHeading';
import DoctorSidebar from '../components/doctor/DoctorSideBar';

const DoctorLayout = ({ children, setActiveView, activeView }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    {/* <BlueHeading /> */}
    <div className="flex flex-1 bg-gray-100">
      <div className="w-74">
        <DoctorSidebar setActiveView={setActiveView} activeView={activeView} />
      </div>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-full">
          {children}
        </div>
      </main>
    </div>
    <Footer />
  </div>
);

export default DoctorLayout;