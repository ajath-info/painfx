import React, { useState, useEffect } from "react";
import { Eye, Check, X } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ClinicLayout from "../../layouts/ClinicLayout";
import axios from "axios";
import Loader from "../common/Loader";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_URL = 'https://painfx-2.onrender.com/api';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState({ Upcoming: [], Today: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const todayDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const [upcomingRes, todayRes] = await Promise.all([
        axios.get(`${BASE_URL}/appointment`, { ...headers, params: { type: 'upcoming' } }),
        axios.get(`${BASE_URL}/appointment`, { ...headers, params: { type: 'today' } })
      ]);

      const formatData = (data) =>
        data?.map((item) => ({
          id: item.id,
          name: `${item.patient_fname} ${item.patient_lname}`,
          date: new Date(item.appointment_date).toLocaleDateString(),
          time: item.appointment_time,
          purpose: item.consultation_type || 'General',
          type: item.appointment_type === 'paid' ? 'New Patient' : 'Old Patient',
          amount: `${item.currency} ${item.amount}`,
          status: item.status,
          img: item.patient_profile_image || 'https://via.placeholder.com/40'
        })) || [];

      setAppointments({
        Upcoming: formatData(upcomingRes.data.payload.data),
        Today: formatData(todayRes.data.payload.data),
      });
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusUpdate = async (appointment_id, status) => {
    try {
      await axios.put(`${BASE_URL}/appointment/update`, { appointment_id, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const stats = [
    { label: 'Total Patients', value: 1500, color: '#ec4899 ' },
    { label: 'Today Patients', value: appointments.Today.length, color: '#10b981' },
    { label: 'Appointments', value: appointments.Upcoming.length, color: '#3b82f6' },
  ];

  const chartOptions = { cutout: '70%', responsive: true, plugins: { legend: { display: false } } };

  const generateChartData = (percentage, color) => ({
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [color, '#e5e7eb'],
      borderWidth: 0,
    }],
  });

  const filteredAppointments = appointments[activeTab] || [];

  return (
    <ClinicLayout>
      <div className="min-h-screen bg-gray-100">
        <main className="p-4 sm:p-6 md:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow flex items-center p-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24">
                  <Doughnut data={generateChartData(Math.min(item.value / 20, 100), item.color)} options={chartOptions} />
                </div>
                <div className="ml-4">
                  <h4 className="text-base sm:text-lg font-semibold mb-1">{item.label}</h4>
                  <p className="text-xl sm:text-2xl font-bold text-black">{item.value}</p>
                  <p className="text-sm sm:text-lg text-gray-500">{item.label === 'Total Patients' ? 'Till Today' : todayDate}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Appointment Tabs */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="flex space-x-4 mb-4 flex-wrap">
              {['Upcoming', 'Today'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm sm:text-base ${activeTab === tab ? 'bg-blue-100 text-blue-600' : 'border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              {loading ? (
                <Loader/>
              ) : (
                <>
                  <table className="hidden md:table w-full text-left text-sm">
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
                          <tr key={appt.id} className="hover:bg-gray-50">
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
                              {appt.status === 'pending' && (
                                <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')} className="px-2 py-1 rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center space-x-1">
                                  <Check size={16} />
                                  <span>Accept</span>
                                </button>
                              )}
                              <button
                                onClick={() => appt.status !== 'cancelled' && handleStatusUpdate(appt.id, 'cancelled')}
                                className={`px-2 py-1 rounded border ${appt.status === 'cancelled' ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'} flex items-center space-x-1`}
                                disabled={appt.status === 'cancelled'}
                              >
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

                  {/* Card Layout for Mobile */}
                  <div className="block md:hidden space-y-4">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appt) => (
                        <div key={appt.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3 mb-2">
                            <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-full" />
                            <span className="font-semibold">{appt.name}</span>
                          </div>
                          <p><span className="font-medium">Date:</span> {appt.date} ({appt.time})</p>
                          <p><span className="font-medium">Purpose:</span> {appt.purpose}</p>
                          <p><span className="font-medium">Type:</span> {appt.type}</p>
                          <p><span className="font-medium">Amount:</span> {appt.amount}</p>
                          <div className="flex space-x-2 mt-3">
                            <button className="px-2 py-1 text-sm rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center space-x-1">
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            {appt.status === 'pending' && (
                              <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')} className="px-2 py-1 text-sm rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center space-x-1">
                                <Check size={14} />
                                <span>Accept</span>
                              </button>
                            )}
                            <button
                              onClick={() => appt.status !== 'cancelled' && handleStatusUpdate(appt.id, 'cancelled')}
                              className={`px-2 py-1 text-sm rounded border ${appt.status === 'cancelled' ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'} flex items-center space-x-1`}
                              disabled={appt.status === 'cancelled'}
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-4 text-gray-500">No appointments found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </ClinicLayout>
  );
};

export default DoctorDashboard;