import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { FaTachometerAlt, FaCalendarCheck, FaUserInjured, FaClock, FaFileInvoiceDollar } from 'react-icons/fa';
import Favourites from "./Favourites";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Appointments');

  const appointments = [
    { id: 1, doctor: 'Dr. Ruby Perrin', specialization: 'Dental', date: '14 Nov 2019', time: '10.00 AM', bookingDate: '12 Nov 2019', amount: '$160', followUp: '16 Nov 2019', status: 'Confirm', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, doctor: 'Dr. Darren Elder', specialization: 'Dental', date: '12 Nov 2019', time: '8.00 PM', bookingDate: '12 Nov 2019', amount: '$250', followUp: '14 Nov 2019', status: 'Confirm', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: 3, doctor: 'Dr. Deborah Angel', specialization: 'Cardiology', date: '11 Nov 2019', time: '11.00 AM', bookingDate: '10 Nov 2019', amount: '$400', followUp: '13 Nov 2019', status: 'Cancelled', img: 'https://randomuser.me/api/portraits/women/47.jpg' },
    { id: 4, doctor: 'Dr. Sofia Brient', specialization: 'Urology', date: '10 Nov 2019', time: '3.00 PM', bookingDate: '10 Nov 2019', amount: '$350', followUp: '12 Nov 2019', status: 'Pending', img: 'https://randomuser.me/api/portraits/women/48.jpg' },
    { id: 5, doctor: 'Dr. Marvin Campbell', specialization: 'Ophthalmology', date: '9 Nov 2019', time: '7.00 PM', bookingDate: '8 Nov 2019', amount: '$75', followUp: '11 Nov 2019', status: 'Confirm', img: 'https://randomuser.me/api/portraits/men/50.jpg' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirm': return 'bg-green-100 text-green-600';
      case 'Pending': return 'bg-yellow-100 text-yellow-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <Header />
      <div className="bg-blue-500 text-white p-4 font-semibold">
        <div className="mx-4">Home / Dashboard</div>
        <div className="mx-4 text-3xl">Dashboard</div>
      </div>

      <div className="flex bg-gray-100 min-h-screen ml-10">
        <aside className="w-84 bg-white shadow-lg p-4 rounded-lg">
          <div className="text-center mb-6">
            <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="User" className="w-24 h-24 rounded-full mx-auto mb-2" />
            <h3 className="font-semibold text-lg">24 July 1983, 38 years</h3>
            <p className="text-sm text-gray-500">Newyork, USA</p>
          </div>

          <nav className="space-y-2 text-lg">
            <Link to="#" className="flex items-center p-3 rounded hover:text-blue-500 border-b border-black">
              <FaTachometerAlt className="mr-3" /> Dashboard
            </Link>
            <Link to="#" onClick={() => setActiveTab('Favourites')} className="flex items-center p-3 rounded hover:text-blue-500 border-b border-black">
              <FaCalendarCheck className="mr-3" /> Favourites
            </Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-blue-500 border-b border-black">
              <FaUserInjured className="mr-3" /> Profile Settings
            </Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-blue-500 border-b border-black">
              <FaClock className="mr-3" /> Change Password
            </Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-blue-500 border-b border-black">
              <FaFileInvoiceDollar className="mr-3" /> Logout
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex space-x-8 pb-2 mb-4 text-lg">
              {['Appointments', 'Favourites', 'Prescriptions', 'Medical Records', 'Billing'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-500 font-semibold' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Appointments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 text-lg">
                      <th className="p-3">Doctor</th>
                      <th className="p-3">Appt Date</th>
                      <th className="p-3">Booking Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Follow Up</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-gray-50">
                        <td className="p-3 flex items-center space-x-3">
                          <img src={appt.img} alt={appt.doctor} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-semibold">{appt.doctor}</div>
                            <div className="text-sm text-gray-500">{appt.specialization}</div>
                          </div>
                        </td>
                        <td className="p-3">{appt.date}<div className="text-blue-500 text-lg">{appt.time}</div></td>
                        <td className="p-3">{appt.bookingDate}</td>
                        <td className="p-3">{appt.amount}</td>
                        <td className="p-3">{appt.followUp}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(appt.status)}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button className="px-3 py-1 text-lg shadow text-green-500 hover:bg-green-500 hover:text-white hover:rounded">
                            <i className="fa-solid fa-eye"></i> View
                          </button>
                          <button className="px-3 py-1 text-lg shadow text-blue-500 hover:bg-blue-500 hover:text-white hover:rounded">
                            <i className="fa-solid fa-print"></i> Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Favourites' && (
              <Favourites />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default PatientDashboard;