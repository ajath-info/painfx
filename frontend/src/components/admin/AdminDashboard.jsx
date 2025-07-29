import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Users, User, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config';

// Example data for charts (unchanged)
const revenueData = [
  { year: '2013', revenue: 65 },
  { year: '2014', revenue: 90 },
  { year: '2015', revenue: 235 },
  { year: '2016', revenue: 130 },
  { year: '2017', revenue: 75 },
  { year: '2018', revenue: 95 },
  { year: '2019', revenue: 300 },
];

const statusData = [
  { year: '2015', status1: 100, status2: 30 },
  { year: '2016', status1: 20, status2: 60 },
  { year: '2017', status1: 90, status2: 120 },
  { year: '2018', status1: 50, status2: 70 },
  { year: '2019', status1: 120, status2: 150 },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
};

const ToggleSwitch = ({ isOn, handleToggle }) => (
  <div
    onClick={handleToggle}
    className={`w-10 h-5 flex items-center bg-${isOn ? 'green' : 'gray'}-400 rounded-full p-1 cursor-pointer transition-colors`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform ${isOn ? 'translate-x-5' : ''} transition-transform`} />
  </div>
);

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    total_revenue: "0.00"
  });
  const token = localStorage.getItem('token'); // Retrieve token from local cache

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1 && response.data.payload) {
          setAnalytics(response.data.payload);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    fetchAnalytics();
  }, [token]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all?role=doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1 && response.data.payload?.users) {
          const latestDoctors = response.data.payload.users
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5)
            .map(doc => ({
              name: `${doc.prefix} ${doc.f_name} ${doc.l_name}`,
              speciality: doc.specializations?.length > 0 ? doc.specializations[0].name : 'N/A', // Use API specializations if available
              earned: `$${doc.earning || '0.00'}`,
              rating: doc.rating || 4, // Use API rating if available, else default to 4
              img: doc.profile_image || 'https://randomuser.me/api/portraits/men/45.jpg', // Fallback image
            }));
          setDoctors(latestDoctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, [token]);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all?role=patient`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1 && response.data.payload?.users) {
          const latestPatients = response.data.payload.users
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5)
            .map(pat => ({
              name: `${pat.prefix} ${pat.f_name} ${pat.l_name}`,
              phone: pat.phone,
              lastVisit: pat.last_appointment ? new Date(pat.last_appointment).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'numeric',
                year: 'numeric',
              }) : 'N/A',
              paid: `$${pat.total_paid || '0.00'}`,
              img: pat.profile_image || 'https://randomuser.me/api/portraits/women/49.jpg', // Fallback image
            }));
          setPatients(latestPatients);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/appointment`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1 && response.data.payload?.data) {
          const latestAppointments = response.data.payload.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(appt => ({
              id: appt.id,
              doctor: {
                name: `${appt.doctor_prefix} ${appt.doctor_fname} ${appt.doctor_lname}`,
                speciality: appt.specializations?.length > 0 ? appt.specializations[0].name : 'N/A',
                img: appt.doctor_profile_image || 'https://randomuser.me/api/portraits/women/44.jpg',
              },
              patient: {
                name: `${appt.patient_fname} ${appt.patient_lname}`,
                img: appt.patient_profile_image || 'https://randomuser.me/api/portraits/women/49.jpg',
              },
              date: new Date(appt.appointment_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'numeric',
                year: 'numeric',
              }),
              time: new Date(`1970-01-01T${appt.appointment_time}Z`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }),
              amount: `$${appt.amount}`,
              status: appt.status === 'confirmed', // Map API status to boolean
            }));
          setAppointments(latestAppointments);
          setStatuses(latestAppointments.map(appt => appt.status)); // Initialize statuses from API
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [token]);

  // Toggle appointment status
  const toggleStatus = async (index) => {
    try {
      const newStatuses = [...statuses];
      const newStatus = !newStatuses[index];
      newStatuses[index] = newStatus;
      setStatuses(newStatuses);

      const appointmentId = appointments[index].id;
      const statusValue = newStatus ? 'confirmed' : 'pending'; // Toggle between 'confirmed' and 'pending'

      await axios.put(
        `${BASE_URL}/appointment/update`,
        { appointment_id: appointmentId, status: statusValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refetch appointments to sync with server state
      const response = await axios.get(`${BASE_URL}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 1 && response.data.payload?.data) {
        const latestAppointments = response.data.payload.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(appt => ({
            id: appt.id,
            doctor: {
              name: `${appt.doctor_prefix} ${appt.doctor_fname} ${appt.doctor_lname}`,
              speciality: appt.specializations?.length > 0 ? appt.specializations[0].name : 'N/A',
              img: appt.doctor_profile_image || 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            patient: {
              name: `${appt.patient_fname} ${appt.patient_lname}`,
              img: appt.patient_profile_image || 'https://randomuser.me/api/portraits/women/49.jpg',
            },
            date: new Date(appt.appointment_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'numeric',
              year: 'numeric',
            }),
            time: new Date(`1970-01-01T${appt.appointment_time}Z`).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            amount: `$${appt.amount}`,
            status: appt.status === 'confirmed', // Map API status to boolean
          }));
        setAppointments(latestAppointments);
        setStatuses(latestAppointments.map(appt => appt.status)); // Update statuses from refetched data
      }
    } catch (error) {
      console.error('Error toggling appointment status:', error);
      // Revert the status change on error
      const newStatuses = [...statuses];
      newStatuses[index] = !newStatuses[index];
      setStatuses(newStatuses);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        {/* Welcome Message */}
        <div className="mb-5">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome Admin!</h1>
          <p className="text-gray-600">Dashboard - Last Updated: {new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">{analytics.total_doctors}</h3>
                <p className="text-sm text-gray-500">Doctors</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((analytics.total_doctors / 20) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                <Users className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">{analytics.total_patients}</h3>
                <p className="text-sm text-gray-500">Patients</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((analytics.total_patients / 20) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                <Calendar className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">{analytics.total_appointments}</h3>
                <p className="text-sm text-gray-500">Appointments</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min((analytics.total_appointments / 100) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
                <DollarSign className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">${parseFloat(analytics.total_revenue).toFixed(2)}</h3>
                <p className="text-sm text-gray-500">Earnings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min((parseFloat(analytics.total_revenue) / 2000) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statusData}>
                <XAxis dataKey="year" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="status1" stroke="#3B82F6" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="status2" stroke="#F59E0B" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor and Patient Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Doctors List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor Name
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speciality
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earned
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <img
                          src={doc.img}
                          alt={`${doc.name}'s profile`}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.speciality}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.earned}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <StarRating rating={doc.rating} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Patients List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                      {/* <svg
                        className="inline w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg> */}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((pat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <img
                          src={pat.img}
                          alt={`${pat.name}'s profile`}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        {pat.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pat.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pat.lastVisit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pat.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Appointment List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Name
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speciality
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Date
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Time
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                    {/* <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg> */}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={appt.doctor.img}
                        alt={`${appt.doctor.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                        onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/women/44.jpg'; }} // Fallback on image error
                      />
                      {appt.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.doctor.speciality}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={appt.patient.img}
                        alt={`${appt.patient.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                        onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/women/49.jpg'; }} // Fallback on image error
                      />
                      {appt.patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sky-500">{appt.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sky-500">{appt.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <ToggleSwitch
                        isOn={statuses[index]}
                        handleToggle={() => toggleStatus(index)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;