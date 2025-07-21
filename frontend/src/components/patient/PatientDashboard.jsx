import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import BASE_URL from '../../config';


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

  useEffect(() => {
    if (activeTab === 'Appointments') fetchAppointments();
    if (activeTab === 'Billing') fetchInvoices();
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/appointment?user_id=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appts = response?.data?.payload?.data || [];

      const mapped = appts.map((a) => ({
        id: a.id,
        doctor: `${a.doctor_fname || ''} ${a.doctor_lname || ''}`.trim() || 'Unknown',
        specialization: a.specializations?.[0]?.name || '.........',
        date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString() : '..........',
        time: formatTimeToAMPM(a.appointment_time),
        bookingDate: a.created_at
          ? new Date(a.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short', // or '2-digit' for numbers
            year: 'numeric',
          })
          : '..........',
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

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/invoice/by-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response?.data?.payload?.data || [];

      const mapped = data.map((invoice) => ({
        id: invoice.id,
        invoiceNo: invoice.invoice_number || '.........',
        doctor: invoice.doctor_name || 'Unknown',
        amount: `$${invoice.total_amount || 0}`,
        paidOn: invoice.invoice_date
          ? new Date(invoice.invoice_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          : '..........',
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

  const renderAppointments = () => {
    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (appointments.length === 0) return <div className="p-4">No appointments found.</div>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-gray-100">
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
              <tr key={appt.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={appt.img}
                    alt={appt.doctor}
                    className="w-10 h-10 rounded-full object-cover"
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
    );
  };

  const renderBilling = () => {
    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (invoices.length === 0) return <div className="p-4">No billing information available.</div>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3">Invoice No</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Paid On</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{inv.invoiceNo}</td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={inv.doctorImg}
                    alt={inv.doctor}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>{inv.doctor}</div>
                </td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">{inv.paidOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className="p-4">
        {/* <h2 className="text-2xl font-semibold mb-2">Dashboard</h2> */}
        {/* <p className="text-gray-600 mb-4">Manage your dashboard information</p> */}

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded shadow-sm">{renderTabContent()}</div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
