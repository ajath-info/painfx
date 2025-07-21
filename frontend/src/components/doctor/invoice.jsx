import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import axios from 'axios';
import Base_url from '../../config';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]); // Ensure invoices is always an array
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get doctor_id and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorId = user?.id;
  const token = localStorage.getItem('token');
  

  // Fetch invoices from API
  useEffect(() => {
  const fetchInvoices = async () => {
    if (!doctorId || !token) {
      setError('Please log in to view invoices.');
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${Base_url}/invoice/by-doctor?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // ✅ Access data directly
      const { payload } = response.data;
      const { data = [], total = 0 } = payload;

      setInvoices(Array.isArray(data) ? data : []);
      setTotal(Number(total));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch invoices. Please try again.');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, [page, limit, doctorId, token, navigate]);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <DoctorLayout>
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Invoices</h2>

        {loading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-4">No invoices found.</div>
        )}

        {!loading && !error && Array.isArray(invoices) && invoices.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Invoice No</th>
                    <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Paid On</th>
                    <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-lg">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.invoice_number || invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <div
                          className="w-10 h-10 bg-gray-300 rounded-full mr-2"
                          style={
                            invoice.user_profile
                              ? { backgroundImage: `url(${invoice.user_profile})`, backgroundSize: 'cover' }
                              : {}
                          }
                        ></div>
                        {invoice.user_name || 'Unknown'}
                        <span className="text-gray-500 ml-2">{invoice.user_id || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${invoice.total_amount || invoice.amount || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : 'Pending'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <button className="px-3 py-1 text-lg shadow text-green-500 hover:bg-green-500 hover:text-white hover:rounded">
                          <i className="fa-solid fa-eye"></i> View
                        </button>
                        <button className="px-3 py-1 text-lg shadow text-blue-500 hover:bg-blue-500 hover:text-white hover:rounded">
                          <i className="fa-solid fa-print"></i> Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <label htmlFor="setLimit" className="mr-2">Rows per page:</label>
                <select
                  id="setLimit"
                  value={limit}
                  onChange={handleLimitChange}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded ${
                      pageNum === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div>
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
              </div>
            </div>
          </>
        )}
      </div>
    </DoctorLayout>
  );
};

export default Invoice;