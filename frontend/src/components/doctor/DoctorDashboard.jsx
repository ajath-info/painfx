import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Appointments from "./Appointments";
import ScheduleTimings from "./ScheduleTimings";
import Mypatients from "./Mypatients";
import Invoice from "./invoice";
import ProfileForm from "./ProfileForm";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaUserInjured,
  FaClock,
  FaFileInvoiceDollar,
  FaStar,
  FaUserCog,
} from "react-icons/fa";

Chart.register(ArcElement, Tooltip);

const ProgressCard = ({ color, icon, label, value, date }) => {
  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, '#e0e0e0'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { animateRotate: true, duration: 1000 },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <div className="relative w-20 h-20">
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {icon}
        </div>
      </div>
      <div className="text-left">
        <h4 className="text-xl font-semibold mb-2">{label}</h4>
        <p className="text-4xl mb-2">{value}</p>
        <p className="text-xl text-gray-500">{date}</p>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [activeView, setActiveView] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState("Upcoming");

  const appointments = [
    { id: 1, name: "Richard Wilson", date: "11 Nov 2019", time: "10:00 AM", purpose: "General", type: "New Patient", amount: "$150", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Charlene Reed", date: "3 Nov 2019", time: "11:00 AM", purpose: "General", type: "Old Patient", amount: "$200", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "John Smith", date: "6 Nov 2019", time: "9:30 AM", purpose: "Consultation", type: "New Patient", amount: "$180", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 4, name: "Emma Watson", date: "6 Nov 2019", time: "2:00 PM", purpose: "Checkup", type: "Old Patient", amount: "$150", img: "https://randomuser.me/api/portraits/women/4.jpg" },
  ];

  const todayDate = "6 Nov 2019";
  const filteredAppointments = activeTab === "Today" ? appointments.filter(appt => appt.date === todayDate) : appointments;

  return (
    <div>
      <Header />

      <div className="text-white bg-blue-500 p-4 font-semibold">
        <a className="mx-4" href="">Home / Dashboard</a>
        <br />
        <a className="text-white text-3xl mx-4" href="">Dashboard</a>
      </div>

      <div className="flex bg-gray-100 min-h-screen ml-10">
        <aside className="w-84 bg-white shadow-lg p-4 rounded-lg">
          <div className="text-center mb-6">
            <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="Doctor" className="w-24 h-24 rounded-full mx-auto mb-2" />
            <h3 className="font-semibold text-lg">Dr. Darren Elder</h3>
            <p className="text-sm text-gray-500">BDS, MDS - Oral Surgery</p>
          </div>

          <nav className="space-y-2 text-lg">
            <Link to="#" onClick={() => setActiveView("Dashboard")} className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaTachometerAlt className="mr-3" /> Dashboard</Link>
            <Link to="#" onClick={() => setActiveView("Appointments")} className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaCalendarCheck className="mr-3" /> Appointments</Link>
            <Link to="#" onClick={() => setActiveView("Mypatients")} className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaUserInjured className="mr-3" /> My Patients</Link>
            <Link to="#" onClick={() => setActiveView("ScheduleTimings")} className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaClock className="mr-3" /> Schedule Timings</Link>
            <Link to="#" onClick={() => setActiveView("Invoice")} className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaFileInvoiceDollar className="mr-3" /> Invoices</Link>
            <Link to="#" className="flex items-center p-3 rounded hover:text-[#2B7FFF] border-b border-black"><FaStar className="mr-3" /> Reviews</Link>
            <Link to="#" onClick={() => setActiveView("ProfileForm")} className="flex items-center p-3 rounded hover:text-[#2B7FFF]"><FaUserCog className="mr-3" /> Profile Settings</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeView === "Dashboard" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ProgressCard color="#f472b6" icon={<FaUserInjured />} label="Total Patient" value={75} date="Till Today" />
                <ProgressCard color="#34d399" icon={<FaCalendarCheck />} label="Today Patient" value={55} date="06, Nov 2019" />
                <ProgressCard color="#3b82f6" icon={<FaClock />} label="Appointments" value={85} date="06, Apr 2019" />
              </div>

              <div className="bg-white rounded shadow p-4 mb-8">
                <h2 className="text-3xl font-semibold mb-8">Patient Appointments</h2>
                <div className="flex space-x-4 mb-4">
                  <button className={`rounded-full px-4 py-2 ${activeTab === "Upcoming" ? "bg-blue-100 text-blue-600" : "border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white"}`} onClick={() => setActiveTab("Upcoming")}>Upcoming</button>
                  <button className={`rounded-full px-4 py-2 ${activeTab === "Today" ? "bg-blue-100 text-blue-600" : "border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white"}`} onClick={() => setActiveTab("Today")}>Today</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-lg">
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Appt Date</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Paid Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-lg">
                      {filteredAppointments.length > 0 ? filteredAppointments.map(appt => (
                        <tr key={appt.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 flex items-center space-x-3">
                            <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-full" />
                            <span>{appt.name}</span>
                          </td>
                          <td className="p-3">{appt.date}<div className="text-blue-500 text-sm">{appt.time}</div></td>
                          <td className="p-3">{appt.purpose}</td>
                          <td className="p-3">{appt.type}</td>
                          <td className="p-3">{appt.amount}</td>
                          <td className="p-3 flex space-x-2">
                            <button className="px-3 py-1 text-lg text-blue-500 hover:bg-blue-500 hover:text-white hover:rounded"><i className="fa-solid fa-eye"></i> View</button>
                            <button className="px-3 py-1 text-lg text-green-500 hover:bg-green-500 hover:text-white hover:rounded"><i className="fa-solid fa-check"></i> Accept</button>
                            <button className="px-3 py-1 text-lg text-red-500 hover:bg-red-500 hover:text-white hover:rounded"><i className="fa-solid fa-xmark"></i> Cancel</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="6" className="text-center p-4 text-gray-500">No appointments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === "Appointments" && <Appointments />}
          {activeView === "Mypatients" && <Mypatients />}
          {activeView === "ScheduleTimings" && <ScheduleTimings />}
          {activeView === "Invoice" && <Invoice />}
          {activeView === "ProfileForm" && <ProfileForm />}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
