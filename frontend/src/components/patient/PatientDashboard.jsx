import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import BASE_URL from '../../config';
import InvoicePDF from '../common/invoicePdf';
import { useNavigate } from 'react-router-dom';

const tabs = ['Appointments', 'Prescriptions', 'Medical Records', 'Billing'];

const formatTimeToAMPM = (timeStr) => {
  if (!timeStr) return '..........';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Appointments');
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [appointmentTotal, setAppointmentTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 10;
  const maxVisiblePages = 6; // Maximum number of page buttons to show before truncation

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'Appointments' && userId) fetchAppointments(appointmentPage);
    if (activeTab === 'Billing' && userId) fetchInvoices(invoicePage);
  }, [activeTab, appointmentPage, invoicePage, userId]);

  const fetchAppointments = async (page) => {
    if (!userId || !token) {
      setError('User not logged in.');
      navigate('/login', { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/appointment/?limit=${limit}&page=${page}&user_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appts = response?.data?.payload?.data || [];
      const total = response?.data?.payload?.total || 0;
      setAppointmentTotal(total);

      const mapped = appts.map((a) => ({
        id: a.id,
        doctor: `${a?.doctor_prefix || ''} ${a.doctor_fname || ''} ${a.doctor_lname || ''}`.trim() || 'Unknown',
        specialization: a.specializations?.[0]?.name || '.........',
        date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString() : '..........',
        time: formatTimeToAMPM(a.appointment_time),
        bookingDate: a.created_at ? new Date(a.created_at).toLocaleDateString() : '..........',
        amount: `${a.currency === 'AUD' ? '$' : '$'}${a.amount || 0}`,
        followUp: a.follow_up || '..........',
        status: a.status || 'Pending',
        img: a.doctor_profile_image || 'https://via.placeholder.com/100x100?text=No+Image',
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (page) => {
    if (!userId || !token) {
      setError('User not logged in.');
      navigate('/login', { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/invoice/by-user?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response?.data?.payload?.data || [];
      const total = response?.data?.payload?.total || 0;
      setInvoiceTotal(total);

      const mapped = data.map((invoice) => ({
        id: invoice.id,
        invoiceNo: invoice.invoice_number || '.........',
        doctor: invoice.doctor_name || 'Unknown',
        amount: `$${invoice.total_amount || 0}`,
        paidOn: invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : '..........',
        doctorImg: invoice.doctor_profile || 'https://via.placeholder.com/100x100?text=No+Image',
      }));

      setInvoices(mapped);
    } catch (err) {
      console.error(err);
      setError('Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(`${BASE_URL}/invoice/details/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.payload) {
        alert('Invoice data not found.');
        return;
      }

      setSelectedInvoice(res.data.payload);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      alert('Failed to fetch invoice details.');
    }
  };

  const renderPagination = (total, currentPage, setPage) => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    // Calculate the range of pages to display
    const pageNumbers = [];
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first 3, last 3, and ellipsis where needed
      const firstPages = [1, 2, 3];
      const lastPages = [totalPages - 2, totalPages - 1, totalPages];

      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last 2 pages
        pageNumbers.push(...firstPages, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3 pages
        pageNumbers.push(1, '...', ...lastPages);
      } else {
        // Show first page, ellipsis, current page with neighbors, ellipsis, last page
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => {
            setPage(currentPage - 1);
            if (activeTab === 'Appointments') fetchAppointments(currentPage - 1);
            if (activeTab === 'Billing') fetchInvoices(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (page !== '...') {
                setPage(page);
                if (activeTab === 'Appointments') fetchAppointments(page);
                if (activeTab === 'Billing') fetchInvoices(page);
              }
            }}
            className={`px-3 py-1 rounded ${
              page === currentPage ? 'bg-blue-600 text-white' : page === '...' ? 'bg-gray-200 cursor-default' : 'bg-gray-200'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => {
            setPage(currentPage + 1);
            if (activeTab === 'Appointments') fetchAppointments(currentPage + 1);
            if (activeTab === 'Billing') fetchInvoices(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderAppointments = () => {
    if (!userId) return <div className="p-4 text-red-500">Please log in to view appointments.</div>;
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (appointments.length === 0) return <div className="p-4">No appointments found.</div>;

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-xs sm:text-sm">
                <th className="p-3">Doctor</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Appt Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Booking Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={appt.img}
                      alt={appt.doctor}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div>{appt.doctor}</div>
                  </td>
                  <td className="p-3">{appt.specialization}</td>
                  <td className="p-3">{appt.date}</td>
                  <td className="p-3">{appt.time}</td>
                  <td className="p-3">{appt.bookingDate}</td>
                  <td className="p-3">{appt.amount}</td>
                  <td className="p-3 capitalize">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(appointmentTotal, appointmentPage, setAppointmentPage)}
      </div>
    );
  };

  const renderBilling = () => {
    if (!userId) return <div className="p-4 text-red-500">Please log in to view billing information.</div>;
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (invoices.length === 0) return <div className="p-4">No billing information available.</div>;

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-xs sm:text-sm">
                <th className="p-3">Invoice No</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Paid On</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={inv.doctorImg}
                      alt={inv.doctor}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div>{inv.doctor}</div>
                  </td>
                  <td className="p-3">{inv.amount}</td>
                  <td className="p-3">{inv.paidOn}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewInvoice(inv.id)}
                      className="px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded shadow"
                    >
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(invoiceTotal, invoicePage, setInvoicePage)}
        {modalOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
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
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Appointments':
        return renderAppointments();
      case 'Prescriptions':
        return <div className="p-4">No prescriptions available.</div>;
      case 'Medical Records':
        return <div className="p-4">No medical records available.</div>;
      case 'Billing':
        return renderBilling();
      default:
        return null;
    }
  };

  return (
    <PatientLayout>
      <div className="p-3 sm:p-4">
        <div className="flex overflow-x-auto border-b mb-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Appointments') setAppointmentPage(1);
                if (tab === 'Billing') setInvoicePage(1);
              }}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white rounded shadow-sm">{renderTabContent()}</div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;