import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InvoicePDF from "../common/invoicePdf";
import axios from 'axios';
import Base_url from '../../config';

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
  const [transactionData, setTransactionData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const token = localStorage.getItem('token');

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${Base_url}/invoice/filter?limit=${entriesPerPage}&page=${page}`;
      const params = [];
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (startDate) params.push(`start_date=${encodeURIComponent(startDate)}`);
      if (endDate) params.push(`end_date=${encodeURIComponent(endDate)}`);
      if (params.length > 0) url += `&${params.join('&')}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || response.data.status !== 1) {
        throw new Error(response.data?.message || 'Failed to fetch transactions');
      }

      const mappedTransactions = response.data.payload.data.map(transaction => ({
        id: transaction.id,
        invoiceNumber: transaction.invoice_number,
        patientId: transaction.user_id.toString(),
        patientName: transaction.user_name || 'Unknown Patient',
        patientImg: transaction.user_profile || 'https://picsum.photos/id/237/50/50',
        totalAmount: parseFloat(transaction.total_amount) || 0,
        status: transaction.status,
      }));

      setTransactionData(mappedTransactions);
      setTotalPages(Math.ceil(response.data.payload.total / entriesPerPage));
    } catch (err) {
      setError(err.message || 'An error occurred while fetching transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, entriesPerPage, status, startDate, endDate]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchTransactions(1);
  };

  const handleViewInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(`${Base_url}/invoice/details/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.payload) {
        alert("Invoice data not found.");
        return;
      }

      setSelectedInvoice(res.data.payload);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching invoice details:", err);
      alert("Failed to fetch invoice details.");
    }
  };

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
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-500 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              currentPage === page
                ? "bg-cyan-500 text-white"
                : "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"
            } transition-colors duration-200`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-500 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Invoice</h2>
          <p className="text-gray-600">Dashboard / Invoice</p>
        </div>

        {loading && currentPage === 1 ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Entries and Filters */}
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
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleFilter}
                  className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-500 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  Filter
                </button>
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
                  {transactionData.map((invoice) => (
                    <tr key={invoice.invoiceNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={invoice.patientImg}
                            alt={`${invoice.patientName}'s profile`}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <span>{invoice.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            invoice.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="px-3 py-1 text-lg text-green-500 hover:bg-green-500 hover:text-white rounded shadow"
                        >
                          <i className="fa-solid fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactionData.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, transactionData.length + (currentPage - 1) * entriesPerPage)} of{" "}
                {entriesPerPage * totalPages} entries
              </div>
              {renderPagination()}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
            <button
              onClick={() => setModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 text-gray-500 text-2xl hover:text-[#F60002]"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Invoice #{selectedInvoice.invoice_number}
            </h2>

            <InvoicePDF invoice={selectedInvoice} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Transactions;