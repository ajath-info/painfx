import React, { useState, useEffect } from 'react';
import ClinitLayout from '../../layouts/ClinicLayout';
import axios from 'axios';

const token = 'YOUR_TOKEN_HERE';
const BASE_URL = 'https://painfx-2.onrender.com/api';

const DoctorsManagement = () => {
  const [doctorData, setDoctorData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/all?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedDoctors = res.data.payload.users.map((doc) => ({
        id: doc.id,
        name: `${doc.prefix}. ${doc.f_name} ${doc.l_name}`,
        specialty:
          doc.specializations?.map((s) => s.name).join(', ') || 'N/A',
        avatar: doc.profile_image || 'https://via.placeholder.com/40',
        memberSince: new Date(doc.created_at).toLocaleDateString(),
        memberTime: new Date(doc.created_at).toLocaleTimeString(),
        earned: `AUD ${doc.earning || '0.00'}`,
        status: doc.status === '1',
      }));

      setDoctorData(formattedDoctors);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const toggleStatus = (id) => {
    setDoctorData((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: !doc.status } : doc
      )
    );
  };

  const totalPages = Math.ceil(doctorData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentDoctors = doctorData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <ClinitLayout>
      <div className="flex-1 p-4 md:p-6">
        {/* Title */}
        <div className="mb-5">
          <h2 className="text-2xl md:text-3xl text-gray-900 mb-1">List of Doctors</h2>
          <p className="text-sm md:text-base text-gray-600">Dashboard / Users / Doctor</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Entries */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm md:text-base">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm md:text-base">entries</span>
            </div>
          </div>

          {/* Table for Desktop, Cards for Mobile */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Doctor Name', 'Specialty', 'Member Since', 'Earned', 'Account Status'].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900">{doctor.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialty}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{doctor.memberSince}</div>
                      <div className="text-gray-500 text-xs">{doctor.memberTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{doctor.earned}</td>
                    <td className="px-6 py-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={doctor.status}
                          onChange={() => toggleStatus(doctor.id)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="md:hidden p-2 space-y-3">
            {currentDoctors.map((doctor) => (
              <div key={doctor.id} className="border p-3 rounded-md shadow-sm">
                <div className="flex items-center mb-3">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Member Since: {doctor.memberSince} ({doctor.memberTime})</p>
                <p className="text-sm text-gray-600 mb-1">Earnings: {doctor.earned}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-700 mr-2">Status:</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={doctor.status}
                      onChange={() => toggleStatus(doctor.id)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
            <div>
              Showing {startIndex + 1} to {Math.min(endIndex, doctorData.length)} of{' '}
              {doctorData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClinitLayout>
  );
};

export default DoctorsManagement;