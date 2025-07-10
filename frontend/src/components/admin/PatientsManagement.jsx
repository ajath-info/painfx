import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

// Sample patient data with formatted IDs and additional patients
const patients = [
  {
    id: '#PT001',
    name: 'John Doe',
    age: 34,
    address: '123 Main St, Springfield',
    phone: '(555) 123-4567',
    lastVisit: 'Jan 15, 2025',
    paid: '$150.00',
    status: true,
    image: 'https://picsum.photos/id/237/50/50',
  },
  {
    id: '#PT002',
    name: 'Jane Smith',
    age: 28,
    address: '456 Oak Ave, Rivertown',
    phone: '(555) 987-6543',
    lastVisit: 'Feb 10, 2025',
    paid: '$200.00',
    status: true,
    image: 'https://picsum.photos/id/238/50/50',
  },
  {
    id: '#PT003',
    name: 'Emily Johnson',
    age: 45,
    address: '789 Pine Rd, Hillcity',
    phone: '(555) 456-7890',
    lastVisit: 'Mar 5, 2025',
    paid: '$175.00',
    status: false,
    image: 'https://picsum.photos/id/239/50/50',
  },
  {
    id: '#PT004',
    name: 'Michael Brown',
    age: 60,
    address: '321 Cedar Ln, Laketown',
    phone: '(555) 321-9876',
    lastVisit: 'Apr 20, 2025',
    paid: '$250.00',
    status: true,
    image: 'https://picsum.photos/id/240/50/50',
  },
  {
    id: '#PT005',
    name: 'Sarah Davis',
    age: 19,
    address: '654 Elm St, Brooksville',
    phone: '(555) 654-3210',
    lastVisit: 'May 12, 2025',
    paid: '$100.00',
    status: false,
    image: 'https://picsum.photos/id/241/50/50',
  },
  {
    id: '#PT006',
    name: 'David Wilson',
    age: 52,
    address: '987 Maple Dr, Sunnyvale',
    phone: '(555) 111-2222',
    lastVisit: 'Jun 8, 2025',
    paid: '$180.00',
    status: true,
    image: 'https://picsum.photos/id/242/50/50',
  },
  {
    id: '#PT007',
    name: 'Laura Martinez',
    age: 37,
    address: '147 Birch Ave, Greentown',
    phone: '(555) 333-4444',
    lastVisit: 'Jul 1, 2025',
    paid: '$220.00',
    status: false,
    image: 'https://picsum.photos/id/243/50/50',
  },
  {
    id: '#PT008',
    name: 'Robert Taylor',
    age: 29,
    address: '258 Walnut St, Fairview',
    phone: '(555) 555-6666',
    lastVisit: 'Aug 15, 2025',
    paid: '$190.00',
    status: true,
    image: 'https://picsum.photos/id/244/50/50',
  },
  {
    id: '#PT009',
    name: 'Amanda Lee',
    age: 41,
    address: '369 Spruce Ct, Riverview',
    phone: '(555) 777-8888',
    lastVisit: 'Sep 10, 2025',
    paid: '$210.00',
    status: true,
    image: 'https://picsum.photos/id/245/50/50',
  },
  {
    id: '#PT010',
    name: 'Thomas Clark',
    age: 63,
    address: '741 Oakwood Rd, Hillcrest',
    phone: '(555) 999-0000',
    lastVisit: 'Oct 5, 2025',
    paid: '$230.00',
    status: false,
    image: 'https://picsum.photos/id/246/50/50',
  },
  {
    id: '#PT011',
    name: 'Lisa Anderson',
    age: 26,
    address: '852 Laurel Ln, Bayside',
    phone: '(555) 222-3333',
    lastVisit: 'Nov 12, 2025',
    paid: '$170.00',
    status: true,
    image: 'https://picsum.photos/id/247/50/50',
  },
  {
    id: '#PT012',
    name: 'James White',
    age: 48,
    address: '963 Cedar St, Lakeside',
    phone: '(555) 444-5555',
    lastVisit: 'Dec 1, 2025',
    paid: '$200.00',
    status: true,
    image: 'https://picsum.photos/id/248/50/50',
  },
  {
    id: '#PT013',
    name: 'Patricia Harris',
    age: 33,
    address: '159 Pinewood Dr, Crestview',
    phone: '(555) 666-7777',
    lastVisit: 'Jan 20, 2026',
    paid: '$195.00',
    status: false,
    image: 'https://picsum.photos/id/249/50/50',
  },
  {
    id: '#PT014',
    name: 'William Lewis',
    age: 55,
    address: '753 Elmwood Ave, Brookfield',
    phone: '(555) 888-9999',
    lastVisit: 'Feb 15, 2026',
    paid: '$240.00',
    status: true,
    image: 'https://picsum.photos/id/250/50/50',
  },
  {
    id: '#PT015',
    name: 'Jennifer Walker',
    age: 22,
    address: '951 Birch Rd, Sunnyhill',
    phone: '(555) 000-1111',
    lastVisit: 'Mar 10, 2026',
    paid: '$160.00',
    status: false,
    image: 'https://picsum.photos/id/251/50/50',
  },
];

const PatientManagement = () => {
  const [patientData] = useState(patients);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        <div className="mb-5">
          <h2 className="text-3xl text-gray-900 mb-2">List of Patients</h2>
          <p className="text-gray-600">Dashboard / Users / Patient</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Entries */}
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
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
                    Age
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
                    Address
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
                {currentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img
                        src={patient.image}
                        alt={`${patient.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.paid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, patientData.length)} of{' '}
              {patientData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientManagement;