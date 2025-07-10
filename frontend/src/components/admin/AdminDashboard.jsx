import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Users, User, Calendar, DollarSign } from 'lucide-react';

// Example data
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

const doctors = [
  { name: 'Dr. Ruby Perrin', speciality: 'Dental', earned: '$3200.00', rating: 4, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Dr. Darren Elder', speciality: 'Dental', earned: '$3100.00', rating: 4, img: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'Dr. Deborah Angel', speciality: 'Cardiology', earned: '$4000.00', rating: 4, img: 'https://randomuser.me/api/portraits/women/46.jpg' },
  { name: 'Dr. Sofia Brient', speciality: 'Urology', earned: '$3200.00', rating: 4, img: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { name: 'Dr. Marvin Campbell', speciality: 'Orthopaedics', earned: '$3500.00', rating: 4, img: 'https://randomuser.me/api/portraits/men/48.jpg' },
];

const patients = [
  { name: 'Charlene Reed', phone: '8286329170', lastVisit: '20 Oct 2019', paid: '$100.00', img: 'https://randomuser.me/api/portraits/women/49.jpg' },
  { name: 'Travis Trimble', phone: '2077299974', lastVisit: '22 Oct 2019', paid: '$200.00', img: 'https://randomuser.me/api/portraits/men/50.jpg' },
  { name: 'Carl Kelly', phone: '2607247769', lastVisit: '21 Oct 2019', paid: '$250.00', img: 'https://randomuser.me/api/portraits/men/51.jpg' },
  { name: 'Michelle Fairfax', phone: '5043686874', lastVisit: '21 Sep 2019', paid: '$150.00', img: 'https://randomuser.me/api/portraits/women/52.jpg' },
  { name: 'Gina Moore', phone: '9548207887', lastVisit: '18 Sep 2019', paid: '$350.00', img: 'https://randomuser.me/api/portraits/women/53.jpg' },
];

const appointments = [
  {
    doctor: { name: 'Dr. Ruby Perrin', speciality: 'Dental', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    patient: { name: 'Charlene Reed', img: 'https://randomuser.me/api/portraits/women/49.jpg' },
    date: '9 Nov 2019',
    time: '11.00 AM - 11.15 AM',
    amount: '$200.00',
  },
  {
    doctor: { name: 'Dr. Darren Elder', speciality: 'Dental', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
    patient: { name: 'Travis Trimble', img: 'https://randomuser.me/api/portraits/men/50.jpg' },
    date: '5 Nov 2019',
    time: '11.00 AM - 11.35 AM',
    amount: '$300.00',
  },
  {
    doctor: { name: 'Dr. Deborah Angel', speciality: 'Cardiology', img: 'https://randomuser.me/api/portraits/women/46.jpg' },
    patient: { name: 'Carl Kelly', img: 'https://randomuser.me/api/portraits/men/51.jpg' },
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
  },
  {
    doctor: { name: 'Dr. Sofia Brient', speciality: 'Urology', img: 'https://randomuser.me/api/portraits/women/47.jpg' },
    patient: { name: 'Michelle Fairfax', img: 'https://randomuser.me/api/portraits/women/52.jpg' },
    date: '7 Nov 2019',
    time: '1.00 PM - 1.20 PM',
    amount: '$150.00',
  },
  {
    doctor: { name: 'Dr. Marvin Campbell', speciality: 'Orthopaedics', img: 'https://randomuser.me/api/portraits/men/48.jpg' },
    patient: { name: 'Gina Moore', img: 'https://randomuser.me/api/portraits/women/53.jpg' },
    date: '15 Nov 2019',
    time: '1.00 PM - 1.15 PM',
    amount: '$200.00',
  },
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
  const [statuses, setStatuses] = useState(appointments.map(() => true));

  const toggleStatus = (index) => {
    const newStatuses = [...statuses];
    newStatuses[index] = !newStatuses[index];
    setStatuses(newStatuses);
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        {/* Welcome Message */}
        <div className="mb-5">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome Admin!</h1>
          <p className="text-gray-600">Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">150</h3>
                <p className="text-sm text-gray-500">Doctors</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                <User className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">200</h3>
                <p className="text-sm text-gray-500">Patients</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                <Calendar className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">180</h3>
                <p className="text-sm text-gray-500">Appointments</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
                <DollarSign className="w-6 h-6" />
              </span>
              <div className="text-right">
                <h3 className="text-2xl font-semibold text-gray-900">$25K</h3>
                <p className="text-sm text-gray-500">Earnings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
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
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speciality
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earned
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                      <svg
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
                      </svg>
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
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                      <svg
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
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                      <svg
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
                      </svg>
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
                    <svg
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
                      </svg>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speciality
                    <svg
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
                      </svg>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                    <svg
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
                      </svg>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Time
                    <svg
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
                      </svg>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    <svg
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
                      </svg>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                    <svg
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
                      </svg>
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
                      />
                      {appt.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.doctor.speciality}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={appt.patient.img}
                        alt={`${appt.patient.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      {appt.patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{appt.date}</div>
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