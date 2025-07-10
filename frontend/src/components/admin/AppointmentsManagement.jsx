import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const appointments = [
  {
    id: 1,
    doctorName: 'Dr. Darren Elder',
    doctorImg: 'https://picsum.photos/id/257/50/50',
    speciality: 'Dental',
    patientName: 'Travis Trimble',
    patientImg: 'https://picsum.photos/id/258/50/50',
    date: '5 Nov 2019',
    time: '11.00 AM - 11.35 AM',
    amount: '$300.00',
    status: true,
  },
  {
    id: 2,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 3,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 4,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 5,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 6,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 7,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 8,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
  {
    id: 9,
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    speciality: 'Cardiology',
    patientName: 'Carl Kelly',
    patientImg: 'https://picsum.photos/id/260/50/50',
    date: '11 Nov 2019',
    time: '12.00 PM - 12.15 PM',
    amount: '$150.00',
    status: true,
  },
];

const AppointmentsManagement = () => {
  const [appointmentData, setAppointmentData] = useState(appointments);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleStatus = (id) => {
    setAppointmentData((prevData) =>
      prevData.map((appt) =>
        appt.id === id ? { ...appt, status: !appt.status } : appt
      )
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(appointmentData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentAppointments = appointmentData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        <div className="mb-5">
          <h2 className="text-3xl text-gray-900 mb-2">Appointments</h2>
          <p className="text-gray-600">Dashboard / Appointments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Entries Selection */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700">entries</span>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </button>
          </div>

          {/* Table */}
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
                {currentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={appt.doctorImg}
                        alt={`${appt.doctorName}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      {appt.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appt.speciality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={appt.patientImg}
                        alt={`${appt.patientName}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      {appt.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{appt.date}</div>
                      <div className="text-sky-500">{appt.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={appt.status}
                          onChange={() => toggleStatus(appt.id)}
                        />
                        <div
                          className={`relative w-10 h-5 rounded-full ${
                            appt.status ? 'bg-green-400' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                              appt.status ? 'translate-x-5' : ''
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appt.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, appointmentData.length)} of{' '}
              {appointmentData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentsManagement;