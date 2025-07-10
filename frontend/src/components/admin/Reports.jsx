import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const reports = [
  {
    invoiceNumber: '#INV001',
    patientId: 'P001',
    patientName: 'John Doe',
    patientImg: 'https://picsum.photos/id/237/50/50',
    totalAmount: 150.00,
    createdDate: 'Jan 15, 2025',
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV002',
    patientId: 'P002',
    patientName: 'Jane Smith',
    patientImg: 'https://picsum.photos/id/238/50/50',
    totalAmount: 200.50,
    createdDate: 'Feb 10, 2025',
    status: 'Pending',
  },
  {
    invoiceNumber: '#INV003',
    patientId: 'P003',
    patientName: 'Emily Johnson',
    patientImg: 'https://picsum.photos/id/239/50/50',
    totalAmount: 75.25,
    createdDate: 'Mar 5, 2025',
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV004',
    patientId: 'P004',
    patientName: 'Michael Brown',
    patientImg: 'https://picsum.photos/id/240/50/50',
    totalAmount: 300.00,
    createdDate: 'Apr 20, 2025',
    status: 'Overdue',
  },
  {
    invoiceNumber: '#INV005',
    patientId: 'P005',
    patientName: 'Sarah Davis',
    patientImg: 'https://picsum.photos/id/241/50/50',
    totalAmount: 125.75,
    createdDate: 'May 12, 2025',
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV006',
    patientId: 'P006',
    patientName: 'David Wilson',
    patientImg: 'https://picsum.photos/id/242/50/50',
    totalAmount: 180.00,
    createdDate: 'Jun 8, 2025',
    status: 'Pending',
  },
  {
    invoiceNumber: '#INV007',
    patientId: 'P007',
    patientName: 'Laura Martinez',
    patientImg: 'https://picsum.photos/id/243/50/50',
    totalAmount: 250.30,
    createdDate: 'Jul 1, 2025',
    status: 'Paid',
  },
];

const SortIcon = () => (
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
);

const Reports = () => {
  const [reportData, setReportData] = useState(reports);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    patientId: '',
    patientName: '',
    patientImg: '',
    totalAmount: '',
    createdDate: '',
    status: 'Paid',
  });
  const [formErrors, setFormErrors] = useState({
    invoiceNumber: '',
    patientId: '',
    patientName: '',
    patientImg: '',
    totalAmount: '',
    createdDate: '',
  });

  // Pagination logic
  const totalPages = Math.ceil(reportData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentReports = reportData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (report) => {
    setCurrentReport(report);
    setFormData({
      invoiceNumber: report.invoiceNumber,
      patientId: report.patientId,
      patientName: report.patientName,
      patientImg: report.patientImg,
      totalAmount: report.totalAmount.toString(),
      createdDate: report.createdDate,
      status: report.status,
    });
    setFormErrors({
      invoiceNumber: '',
      patientId: '',
      patientName: '',
      patientImg: '',
      totalAmount: '',
      createdDate: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (invoiceNumber) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReportData(reportData.filter((report) => report.invoiceNumber !== invoiceNumber));
      console.log(`Delete report ${invoiceNumber}`);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      invoiceNumber: '',
      patientId: '',
      patientName: '',
      patientImg: '',
      totalAmount: '',
      createdDate: '',
    };

    if (!formData.invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice number is required';
      isValid = false;
    } else if (!formData.invoiceNumber.match(/^#INV\d{3}$/)) {
      errors.invoiceNumber = 'Invoice number must be in format #INVXXX (e.g., #INV001)';
      isValid = false;
    }

    if (!formData.patientId.trim()) {
      errors.patientId = 'Patient ID is required';
      isValid = false;
    } else if (!formData.patientId.match(/^P\d{3}$/)) {
      errors.patientId = 'Patient ID must be in format PXXX (e.g., P001)';
      isValid = false;
    }

    if (!formData.patientName.trim()) {
      errors.patientName = 'Patient name is required';
      isValid = false;
    }

    if (!formData.patientImg.trim()) {
      errors.patientImg = 'Image URL is required';
      isValid = false;
    } else if (!formData.patientImg.match(/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/)) {
      errors.patientImg = 'Please provide a valid image URL (png, jpg, jpeg, or gif)';
      isValid = false;
    }

    if (!formData.totalAmount.trim()) {
      errors.totalAmount = 'Total amount is required';
      isValid = false;
    } else if (isNaN(formData.totalAmount) || Number(formData.totalAmount) <= 0) {
      errors.totalAmount = 'Total amount must be a positive number';
      isValid = false;
    }

    if (!formData.createdDate.trim()) {
      errors.createdDate = 'Created date is required';
      isValid = false;
    } else if (!formData.createdDate.match(/^\w{3}\s\d{1,2},\s\d{4}$/)) {
      errors.createdDate = 'Date must be in format MMM DD, YYYY (e.g., Jan 15, 2025)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentReport) {
        // Edit existing report
        setReportData((prevData) =>
          prevData.map((report) =>
            report.invoiceNumber === currentReport.invoiceNumber
              ? {
                  ...report,
                  invoiceNumber: formData.invoiceNumber,
                  patientId: formData.patientId,
                  patientName: formData.patientName,
                  patientImg: formData.patientImg,
                  totalAmount: Number(formData.totalAmount),
                  createdDate: formData.createdDate,
                  status: formData.status,
                }
              : report
          )
        );
      } else {
        // Add new report
        const newReport = {
          invoiceNumber: formData.invoiceNumber,
          patientId: formData.patientId,
          patientName: formData.patientName,
          patientImg: formData.patientImg,
          totalAmount: Number(formData.totalAmount),
          createdDate: formData.createdDate,
          status: formData.status,
        };
        setReportData((prevData) => [...prevData, newReport]);
      }
      setIsModalOpen(false);
      setCurrentReport(null);
      setFormData({
        invoiceNumber: '',
        patientId: '',
        patientName: '',
        patientImg: '',
        totalAmount: '',
        createdDate: '',
        status: 'Paid',
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReport(null);
    setFormData({
      invoiceNumber: '',
      patientId: '',
      patientName: '',
      patientImg: '',
      totalAmount: '',
      createdDate: '',
      status: 'Paid',
    });
    setFormErrors({
      invoiceNumber: '',
      patientId: '',
      patientName: '',
      patientImg: '',
      totalAmount: '',
      createdDate: '',
    });
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Reports</h2>
          <p className="text-gray-600">Dashboard / Reports</p>
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
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                    <SortIcon />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReports.map((report) => (
                  <tr key={report.invoiceNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <img
                          src={report.patientImg}
                          alt={`${report.patientName}'s profile`}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <span>{report.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${report.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          report.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(report)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report.invoiceNumber)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, reportData.length)} of{' '}
              {reportData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentReport ? 'Edit Report' : 'Add New Report'}
              </h3>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., #INV001"
                  />
                  {formErrors.invoiceNumber && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.invoiceNumber}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., P001"
                  />
                  {formErrors.patientId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.patientId}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                  />
                  {formErrors.patientName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.patientName}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Patient Image URL</label>
                  <input
                    type="url"
                    name="patientImg"
                    value={formData.patientImg}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., https://example.com/image.jpg"
                  />
                  {formErrors.patientImg && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.patientImg}</p>
                  )}
                </div>
                {formData.patientImg && (
                  <div className="mb-4">
                    <img
                      src={formData.patientImg}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 150.00"
                  />
                  {formErrors.totalAmount && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.totalAmount}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <input
                    type="text"
                    name="createdDate"
                    value={formData.createdDate}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Jan 15, 2025"
                  />
                  {formErrors.createdDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.createdDate}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {currentReport ? 'Save Changes' : 'Add Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;