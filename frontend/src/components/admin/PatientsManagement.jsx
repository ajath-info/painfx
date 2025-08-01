import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AdminLayout from '../../layouts/AdminLayout';
import BASE_URL from '../../config';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ✅ Age Calculation Logic
const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

const PatientManagement = () => {
  const [patientData, setPatientData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token'); // Ensure this is set after login
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/all?role=patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.payload?.users) {
          const formatted = res.data.payload.users.map((user, index) => ({
            id: `#PT${String(index + 1).padStart(3, '0')}`,
            name: `${user.prefix} ${user.f_name} ${user.l_name}`,
            age: user.DOB ? calculateAge(user.DOB) : '..........',
            address: user.city || '..........',
            phone: user.phone || '..........',
            lastVisit: user.last_appointment
              ? new Date(user.last_appointment).toLocaleDateString()
              : '..........',
            paid: `AUD ${user.total_paid || '0.00'}`,
            image: user.profile_image || 'https://via.placeholder.com/40',
            userId: user.id, // Store userId for navigation
          }));

          setPatientData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      }
    };

    fetchPatients();
  }, []);

  // Handle navigation to patient profile
  const handlePatientClick = (userId) => {
    navigate('/patient/profile-view', { state: { userId } }); // Corrected to pass userId directly
  };

  // Pagination logic
  const totalPages = Math.ceil(patientData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPatients = patientData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center space-x-2">
  {/* Previous Button */}
  <button
    onClick={handlePrevious}
    disabled={currentPage === 1}
    className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
  >
    <ChevronLeft className="w-4 h-4 mr-1" />
    Previous
  </button>

  {/* Current Page (Visible only on small screens) */}
  <span className="block sm:hidden px-3 py-1.5 text-sm border border-cyan-500 rounded-lg text-cyan-500">
    {currentPage}
  </span>

  {/* Page Numbers (Hidden on small screens) */}
  <div className="hidden sm:flex space-x-2">
    {pageNumbers.map((page) => (
      <button
        key={page}
        onClick={() => handlePageClick(page)}
        className={`px-3 py-1.5 text-sm rounded-lg ${
          currentPage === page
            ? "bg-cyan-500 text-white"
            : "border border-cyan-500 text-cyan-500 hover:bg-cyan-600 hover:text-white"
        } transition-colors duration-200`}
      >
        {page}
      </button>
    ))}
  </div>

  {/* Next Button */}
  <button
    onClick={handleNext}
    disabled={currentPage === totalPages || totalPages === 0}
    className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
  >
    Next
    <ChevronRight className="w-4 h-4 ml-1" />
  </button>
</div>

    );
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        <div className="mb-5">
          <h2 className="text-3xl text-gray-900 mb-2">List of Patients</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Entries */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Patient ID',
                    'Patient Name',
                    'Age',
                    'Address',
                    'Phone',
                    'Last Visit',
                    'Paid',
                  ].map((heading) => (
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
                {currentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePatientClick(patient.userId)} // Add onClick for navigation
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                      <img
                        src={patient.image}
                        alt={patient.name}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.paid}</td>
                  </tr>
                ))}
                {patientData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, patientData.length)} of{' '}
              {patientData.length} entries
            </div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientManagement;