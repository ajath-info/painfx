import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { FaTachometerAlt, FaCalendarCheck, FaUserInjured, FaClock, FaFileInvoiceDollar, FaStar, FaUserCog } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const appointments = [
    {
      id: 1,
      name: "Richard Wilson",
      date: "11 Nov 2019",
      time: "10:00 AM",
      purpose: "General",
      type: "New Patient",
      amount: "$150",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Charlene Reed",
      date: "3 Nov 2019",
      time: "11:00 AM",
      purpose: "General",
      type: "Old Patient",
      amount: "$200",
      img: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "John Smith",
      date: "6 Nov 2019",
      time: "9:30 AM",
      purpose: "Consultation",
      type: "New Patient",
      amount: "$180",
      img: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      name: "Emma Watson",
      date: "6 Nov 2019",
      time: "2:00 PM",
      purpose: "Checkup",
      type: "Old Patient",
      amount: "$150",
      img: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ];

  const todayDate = "6 Nov 2019";  // Static today date for filtering

  const filteredAppointments = activeTab === 'Today'
    ? appointments.filter(appt => appt.date === todayDate)
    : appointments;

  return (
    <div>
      <Header />
      <div className="text-white bg-blue-500 p-4 font-semibold">
        <a className="mx-4" href="">Home / Dashboard</a> <br />
        <a className="text-white text-3xl mx-4" href="">Dashboard</a>
      </div>

      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-4 rounded-lg">
          <div className="text-center mb-6">
            <img
              src="https://randomuser.me/api/portraits/men/11.jpg"
              alt="Doctor"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold text-lg">Dr. Darren Elder</h3>
            <p className="text-sm text-gray-500">BDS, MDS - Oral Surgery</p>
          </div>

          <nav className="space-y-2">
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaTachometerAlt className="mr-3" /> Dashboard</Link>
            <Link to="/doctor/appointments" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaCalendarCheck className="mr-3" /> Appointments</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaUserInjured className="mr-3" /> My Patients</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaClock className="mr-3" /> Schedule Timings</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaFileInvoiceDollar className="mr-3" /> Invoices</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaStar className="mr-3" /> Reviews</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF]"><FaUserCog className="mr-3" /> Profile Settings</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-4">
              <h4 className="text-lg font-semibold mb-2">Total Patient</h4>
              <p className="text-2xl font-bold text-pink-600">1500</p>
              <p className="text-sm text-gray-500">Till Today</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <h4 className="text-lg font-semibold mb-2">Today Patient</h4>
              <p className="text-2xl font-bold text-green-600">160</p>
              <p className="text-sm text-gray-500">{todayDate}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <h4 className="text-lg font-semibold mb-2">Appointments</h4>
              <p className="text-2xl font-bold text-blue-600">85</p>
              <p className="text-sm text-gray-500">{todayDate}</p>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-8">
            <div className="flex space-x-4 mb-4">
              <button
                className={`rounded-full px-4 py-2 ${activeTab === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                onClick={() => setActiveTab('Upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`rounded-full px-4 py-2 ${activeTab === 'Today' ? 'bg-blue-100 text-blue-600' : 'border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                onClick={() => setActiveTab('Today')}
              >
                Today
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Appt Date</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 flex items-center space-x-3">
                          <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-full" />
                          <span>{appt.name}</span>
                        </td>
                        <td className="p-3">
                          {appt.date}
                          <div className="text-blue-500 text-sm">{appt.time}</div>
                        </td>
                        <td className="p-3">{appt.purpose}</td>
                        <td className="p-3">{appt.type}</td>
                        <td className="p-3">{appt.amount}</td>
                        <td className="p-3 flex space-x-2">
                          <button className="px-3 py-1 text-lg rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"><i className="fa-solid fa-eye"></i></button>
                          <button className="px-3 py-1 text-lg rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"><i className="fa-solid fa-check"></i></button>
                          <button className="px-3 py-1 text-lg rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="text-sm text-gray-500 text-center">© 2025 PainFX. All rights reserved.</footer>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
