import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import PatientLayout from '../../layouts/PatientLayout';

// Patient Data Constants
const DEFAULT_PATIENT = {
  name: 'Richard Wilson',
  dob: '24 Jul 1983',
  age: 38,
  location: 'New York, USA',
  avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
};

const APPOINTMENTS = [
  {
    id: 1,
    doctor: 'Dr. Ruby Perrin',
    specialization: 'Dental',
    date: '14 Nov 2019',
    time: '10.00 AM',
    bookingDate: '12 Nov 2019',
    amount: '$160',
    followUp: '16 Nov 2019',
    status: 'Confirm',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    doctor: 'Dr. Darren Elder',
    specialization: 'Dental',
    date: '12 Nov 2019',
    time: '8.00 PM',
    bookingDate: '12 Nov 2019',
    amount: '$250',
    followUp: '14 Nov 2019',
    status: 'Confirm',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    doctor: 'Dr. Deborah Angel',
    specialization: 'Cardiology',
    date: '11 Nov 2019',
    time: '11.00 AM',
    bookingDate: '10 Nov 2019',
    amount: '$400',
    followUp: '13 Nov 2019',
    status: 'Cancelled',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    id: 4,
    doctor: 'Dr. Sofia Brient',
    specialization: 'Urology',
    date: '10 Nov 2019',
    time: '3.00 PM',
    bookingDate: '10 Nov 2019',
    amount: '$350',
    followUp: '12 Nov 2019',
    status: 'Pending',
    img: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    id: 5,
    doctor: 'Dr. Marvin Campbell',
    specialization: 'Ophthalmology',
    date: '9 Nov 2019',
    time: '7.00 PM',
    bookingDate: '8 Nov 2019',
    amount: '$75',
    followUp: '11 Nov 2019',
    status: 'Confirm',
    img: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
];

const PRESCRIPTIONS = [
  {
    id: 1,
    date: '14 Nov 2019',
    name: 'Amoxicillin 500mg',
    createdBy: 'Dr. Ruby Perrin',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    date: '12 Nov 2019',
    name: 'Ibuprofen 200mg',
    createdBy: 'Dr. Darren Elder',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    date: '11 Nov 2019',
    name: 'Lisinopril 10mg',
    createdBy: 'Dr. Deborah Angel',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    id: 4,
    date: '10 Nov 2019',
    name: 'Tamsulosin 0.4mg',
    createdBy: 'Dr. Sofia Brient',
    img: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    id: 5,
    date: '9 Nov 2019',
    name: 'Prednisone 5mg',
    createdBy: 'Dr. Marvin Campbell',
    img: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
];

const MEDICAL_RECORDS = [
  {
    id: 'MR001',
    date: '14 Nov 2019',
    description: 'Dental Checkup',
    attachment: 'dental_report.pdf',
    created: 'Dr. Ruby Perrin',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'MR002',
    date: '12 Nov 2019',
    description: 'Blood Test Results',
    attachment: 'blood_test.pdf',
    created: 'Dr. Darren Elder',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'MR003',
    date: '11 Nov 2019',
    description: 'ECG Report',
    attachment: 'ecg_report.pdf',
    created: 'Dr. Deborah Angel',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    id: 'MR004',
    date: '10 Nov 2019',
    description: 'Ultrasound Scan',
    attachment: 'ultrasound.pdf',
    created: 'Dr. Sofia Brient',
    img: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    id: 'MR005',
    date: '9 Nov 2019',
    description: 'Eye Examination',
    attachment: 'eye_report.pdf',
    created: 'Dr. Marvin Campbell',
    img: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
];

const BILLING = [
  {
    invoiceNo: 'INV001',
    doctor: 'Dr. Ruby Perrin',
    amount: '$160',
    paidOn: '14 Nov 2019',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    invoiceNo: 'INV002',
    doctor: 'Dr. Darren Elder',
    amount: '$250',
    paidOn: '12 Nov 2019',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    invoiceNo: 'INV003',
    doctor: 'Dr. Deborah Angel',
    amount: '$400',
    paidOn: '11 Nov 2019',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    invoiceNo: 'INV004',
    doctor: 'Dr. Sofia Brient',
    amount: '$350',
    paidOn: '10 Nov 2019',
    img: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    invoiceNo: 'INV005',
    doctor: 'Dr. Marvin Campbell',
    amount: '$75',
    paidOn: '9 Nov 2019',
    img: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
];

// Reusable DataDisplay Component
const getStatusStyle = (status) => {
  switch (status) {
    case 'Confirm':
      return 'bg-green-100 text-green-600';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-600';
    case 'Cancelled':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const DataDisplay = ({ headers, data, renderRow, renderCard }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = useCallback(
    (key) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
      }));
    },
    []
  );

  // Enhanced sorting for dates and amounts
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle date sorting
    if (sortConfig.key.includes('date') || sortConfig.key === 'paidOn') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    // Handle amount sorting
    else if (sortConfig.key === 'amount') {
      aValue = parseFloat(aValue.replace('$', '')) || 0;
      bValue = parseFloat(bValue.replace('$', '')) || 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden sm:table" aria-label="Data table">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  header.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                }`}
                onClick={() => header.sortable && handleSort(header.key)}
                onKeyDown={(e) => header.sortable && e.key === 'Enter' && handleSort(header.key)}
                role="columnheader"
                aria-sort={sortConfig.key === header.key ? sortConfig.direction : 'none'}
                tabIndex={header.sortable ? 0 : -1}
              >
                {header.label}
                {header.sortable && (
                  <svg
                    className="inline w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        sortConfig.key === header.key && sortConfig.direction === 'desc'
                          ? 'M19 14l-7 7m0 0l-7-7m7 7V3'
                          : 'M5 10l7-7m0 0l7 7m-7-7v18'
                      }
                    />
                  </svg>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((item) => renderRow(item))
          )}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-4">
        {sortedData.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No data available</p>
        ) : (
          sortedData.map((item) => renderCard(item))
        )}
      </div>
    </div>
  );
};

DataDisplay.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  renderCard: PropTypes.func.isRequired,
};

// PatientDashboard Component
const PatientDashboard = ({ patient = DEFAULT_PATIENT }) => {
  const [activeTab, setActiveTab] = useState('Appointments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = ['Appointments', 'Prescriptions', 'Medical Records', 'Billing'];

  // Appointments Configuration
  const appointmentHeaders = [
    { key: 'doctor', label: 'Doctor', sortable: true },
    { key: 'date', label: 'Appt Date', sortable: true },
    { key: 'bookingDate', label: 'Booking Date', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'followUp', label: 'Follow Up', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const renderAppointmentRow = (appt) => (
    <tr key={appt.id} className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
        <img
          src={appt.img}
          alt={`${appt.doctor}'s avatar`}
          className="w-8 h-8 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>
          <div className="font-semibold">{appt.doctor}</div>
          <div className="text-sm text-gray-500">{appt.specialization}</div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>{appt.date}</div>
        <div className="text-blue-500">{appt.time}</div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.bookingDate}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.amount}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.followUp}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(appt.status)}`}>{appt.status}</span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
          aria-label={`View appointment with ${appt.doctor}`}
        >
          View
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
          aria-label={`Print appointment with ${appt.doctor}`}
        >
          Print
        </button>
      </td>
    </tr>
  );

  const renderAppointmentCard = (appt) => (
    <div key={appt.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <img
          src={appt.img}
          alt={`${appt.doctor}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>
          <div className="font-semibold text-gray-900">{appt.doctor}</div>
          <div className="text-sm text-gray-500">{appt.specialization}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Appt Date:</span> {appt.date} <br />
          <span className="text-blue-500">{appt.time}</span>
        </div>
        <div>
          <span className="font-medium">Booking Date:</span> {appt.bookingDate}
        </div>
        <div>
          <span className="font-medium">Amount:</span> {appt.amount}
        </div>
        <div>
          <span className="font-medium">Follow Up:</span> {appt.followUp}
        </div>
        <div>
          <span className="font-medium">Status:</span>
          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusStyle(appt.status)}`}>{appt.status}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded"
            aria-label={`View appointment with ${appt.doctor}`}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded"
            aria-label={`Print appointment with ${appt.doctor}`}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );

  // Prescriptions Configuration
  const prescriptionHeaders = [
    { key: 'createdBy', label: 'Created By', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const renderPrescriptionRow = (pres) => (
    <tr key={pres.id} className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
        <img
          src={pres.img}
          alt={`${pres.createdBy}'s avatar`}
          className="w-8 h-8 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{pres.createdBy}</div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pres.date}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pres.name}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
          aria-label={`View prescription from ${pres.createdBy}`}
        >
          View
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
          aria-label={`Print prescription from ${pres.createdBy}`}
        >
          Print
        </button>
      </td>
    </tr>
  );

  const renderPrescriptionCard = (pres) => (
    <div key={pres.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <img
          src={pres.img}
          alt={`${pres.createdBy}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{pres.createdBy}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Date:</span> {pres.date}
        </div>
        <div>
          <span className="font-medium">Name:</span> {pres.name}
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded"
            aria-label={`View prescription from ${pres.createdBy}`}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded"
            aria-label={`Print prescription from ${pres.createdBy}`}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );

  // Medical Records Configuration
  const medicalRecordHeaders = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'attachment', label: 'Attachment', sortable: true },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const renderMedicalRecordRow = (record) => (
    <tr key={record.id} className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.description}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.attachment}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
        <img
          src={record.img}
          alt={`${record.created}'s avatar`}
          className="w-8 h-8 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{record.created}</div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
          aria-label={`View medical record ${record.id}`}
        >
          View
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
          aria-label={`Print medical record ${record.id}`}
        >
          Print
        </button>
      </td>
    </tr>
  );

  const renderMedicalRecordCard = (record) => (
    <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <img
          src={record.img}
          alt={`${record.created}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{record.created}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">ID:</span> {record.id}
        </div>
        <div>
          <span className="font-medium">Date:</span> {record.date}
        </div>
        <div>
          <span className="font-medium">Description:</span> {record.description}
        </div>
        <div>
          <span className="font-medium">Attachment:</span> {record.attachment}
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded"
            aria-label={`View medical record ${record.id}`}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded"
            aria-label={`Print medical record ${record.id}`}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );

  // Billing Configuration
  const billingHeaders = [
    { key: 'invoiceNo', label: 'Invoice No', sortable: true },
    { key: 'doctor', label: 'Doctor', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'paidOn', label: 'Paid On', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const renderBillingRow = (bill) => (
    <tr key={bill.invoiceNo} className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.invoiceNo}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
        <img
          src={bill.img}
          alt={`${bill.doctor}'s avatar`}
          className="w-8 h-8 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{bill.doctor}</div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.amount}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.paidOn}</td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
          aria-label={`View invoice ${bill.invoiceNo}`}
        >
          View
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
          aria-label={`Print invoice ${bill.invoiceNo}`}
        >
          Print
        </button>
      </td>
    </tr>
  );

  const renderBillingCard = (bill) => (
    <div key={bill.invoiceNo} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <img
          src={bill.img}
          alt={`${bill.doctor}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-2"
          onError={(e) => (e.target.src = '/assets/images/default-avatar.jpg')}
        />
        <div>{bill.doctor}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Invoice No:</span> {bill.invoiceNo}
        </div>
        <div>
          <span className="font-medium">Amount:</span> {bill.amount}
        </div>
        <div>
          <span className="font-medium">Paid On:</span> {bill.paidOn}
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-sm bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded"
            aria-label={`View invoice ${bill.invoiceNo}`}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-sm bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded"
            aria-label={`Print invoice ${bill.invoiceNo}`}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PatientLayout
      patient={patient}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <div className="mb-6">
        <nav className="flex flex-wrap gap-4 sm:gap-8 pb-2 border-b border-gray-200" aria-label="Dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm sm:text-lg font-medium ${
                activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Appointments' && (
        <DataDisplay
          headers={appointmentHeaders}
          data={APPOINTMENTS}
          renderRow={renderAppointmentRow}
          renderCard={renderAppointmentCard}
        />
      )}

      {activeTab === 'Prescriptions' && (
        <DataDisplay
          headers={prescriptionHeaders}
          data={PRESCRIPTIONS}
          renderRow={renderPrescriptionRow}
          renderCard={renderPrescriptionCard}
        />
      )}

      {activeTab === 'Medical Records' && (
        <DataDisplay
          headers={medicalRecordHeaders}
          data={MEDICAL_RECORDS}
          renderRow={renderMedicalRecordRow}
          renderCard={renderMedicalRecordCard}
        />
      )}

      {activeTab === 'Billing' && (
        <DataDisplay
          headers={billingHeaders}
          data={BILLING}
          renderRow={renderBillingRow}
          renderCard={renderBillingCard}
        />
      )}
    </PatientLayout>
  );
};

PatientDashboard.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string,
    dob: PropTypes.string,
    age: PropTypes.number,
    location: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default React.memo(PatientDashboard);