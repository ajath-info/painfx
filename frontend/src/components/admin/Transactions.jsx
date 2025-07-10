import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const transactions = [
  {
    invoiceNumber: '#INV001',
    patientId: 'P001',
    patientName: 'John Doe',
    patientImg: 'https://picsum.photos/id/237/50/50',
    totalAmount: 150.00,
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV002',
    patientId: 'P002',
    patientName: 'Jane Smith',
    patientImg: 'https://picsum.photos/id/238/50/50',
    totalAmount: 200.50,
    status: 'Pending',
  },
  {
    invoiceNumber: '#INV003',
    patientId: 'P003',
    patientName: 'Emily Johnson',
    patientImg: 'https://picsum.photos/id/239/50/50',
    totalAmount: 75.25,
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV004',
    patientId: 'P004',
    patientName: 'Michael Brown',
    patientImg: 'https://picsum.photos/id/240/50/50',
    totalAmount: 300.00,
    status: 'Overdue',
  },
  {
    invoiceNumber: '#INV005',
    patientId: 'P005',
    patientName: 'Sarah Davis',
    patientImg: 'https://picsum.photos/id/241/50/50',
    totalAmount: 125.75,
    status: 'Paid',
  },
  {
    invoiceNumber: '#INV006',
    patientId: 'P006',
    patientName: 'David Wilson',
    patientImg: 'https://picsum.photos/id/242/50/50',
    totalAmount: 180.00,
    status: 'Pending',
  },
  {
    invoiceNumber: '#INV007',
    patientId: 'P007',
    patientName: 'Laura Martinez',
    patientImg: 'https://picsum.photos/id/243/50/50',
    totalAmount: 250.30,
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

const Transactions = () => {
  const [transactionData, setTransactionData] = useState(transactions);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(transactionData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTransactions = transactionData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = (invoiceNumber) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactionData(transactionData.filter(transaction => transaction.invoiceNumber !== invoiceNumber));
      console.log(`Delete transaction ${invoiceNumber}`);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Transactions</h2>
          <p className="text-gray-600">Dashboard / Transactions</p>
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
                    Invoice Number
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking මtracking-wider">
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
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.invoiceNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <img
                          src={transaction.patientImg}
                          alt={`${transaction.patientName}'s profile`}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <span>{transaction.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(transaction.invoiceNumber)}
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
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, transactionData.length)} of{' '}
              {transactionData.length} entries
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
      </div>
    </AdminLayout>
  );
};

export default Transactions;