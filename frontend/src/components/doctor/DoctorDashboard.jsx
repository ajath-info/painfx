import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Eye, Check, X } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const appointments = [
    { id: 1, name: "Richard Wilson", date: "11 Nov 2019", time: "10:00 AM", purpose: "General", type: "New Patient", amount: "$150", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Charlene Reed", date: "3 Nov 2019", time: "11:00 AM", purpose: "General", type: "Old Patient", amount: "$200", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "John Smith", date: "6 Nov 2019", time: "9:30 AM", purpose: "Consultation", type: "New Patient", amount: "$180", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 4, name: "Emma Watson", date: "6 Nov 2019", time: "2:00 PM", purpose: "Checkup", type: "Old Patient", amount: "$150", img: "https://randomuser.me/api/portraits/women/4.jpg" },
  ];

  const todayDate = "6 Nov 2019";
  const filteredAppointments = activeTab === 'Today'
    ? appointments.filter(appt => appt.date === todayDate)
    : appointments;

  const stats = [
    { label: 'Total Patients', value: 1500, color: '#ec4899 ' },
    { label: 'Today Patients', value: 160, color: '#10b981' },
    { label: 'Appointments', value: 85, color: '#3b82f6' },
  ];

  const chartOptions = {
    cutout: '70%',
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const generateChartData = (percentage, color) => ({
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [color, '#e5e7eb'],
      borderWidth: 0,
    }],
  });

  return (
    <DoctorLayout>
      <div className="min-h-screen bg-gray-100">

        <main className="p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow flex items-center p-4">
                <div className="w-24 h-24">
                  <Doughnut data={generateChartData(Math.min(item.value / 20, 100), item.color)} options={chartOptions} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold mb-1">{item.label}</h4>
               <p className="text-2xl font-bold text-black">{item.value}</p>

                  <p className="text-lg text-gray-500">{item.label === 'Total Patients' ? 'Till Today' : todayDate}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Appointment Tabs */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
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

            {/* Appointments Table */}
            <div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
    <thead>
      <tr className="bg-gray-100 text-gray-700">
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
          <tr key={appt.id} className="hover:bg-gray-50">   {/* border-b removed here */}
            <td className="p-3 flex items-center space-x-3">
              <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-full" />
              <span>{appt.name}</span>
            </td>
            <td className="p-3">
              {appt.date}
              <div className="text-blue-500 text-xs">{appt.time}</div>
            </td>
            <td className="p-3">{appt.purpose}</td>
            <td className="p-3">{appt.type}</td>
            <td className="p-3">{appt.amount}</td>
            <td className="p-3 flex space-x-2">
              <button className="px-2 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center space-x-1">
                <Eye size={16} />
                <span>View</span>
              </button>
              <button className="px-2 py-1 rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center space-x-1">
                <Check size={16} />
                <span>Accept</span>
              </button>
              <button className="px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center space-x-1">
                <X size={16} />
                <span>Cancel</span>
              </button>
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
        </main>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;