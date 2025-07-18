import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import BASE_URL from '../../config';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbF9uYW1lIjoiQWRtaW4gcmF2aSIsInVzZXJfbmFtZSI6ImFkbWluNjMzIiwicm9sZSI6ImFkbWluIiwicHJvZmlsZV9pbWFnZSI6bnVsbCwic291cmNlIjoiYWRtaW4iLCJpYXQiOjE3NTIyMzEwMTksImV4cCI6MTc1MjgzNTgxOX0.vJIn7j79gbGRG15rQFiTMnEtEu_eqElJBFtv4rZYTxw';


const AppointmentsManagement = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    consultation_type: 'clinic',
    appointment_type: 'paid',
    payment_status: 'pending',
    amount: '',
    currency: 'INR',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
    is_caregiver: false,
  });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data.payload.data;
      const transformed = payload.map(item => ({
        id: item.id,
        doctorName: `Dr. ${item.doctor_fname} ${item.doctor_lname}`,
        doctorImg: 'https://picsum.photos/id/259/50/50',
        speciality: 'N/A',
        patientName: `${item.patient_fname} ${item.patient_lname}`,
        patientImg: 'https://picsum.photos/id/260/50/50',
        date: new Date(item.appointment_date).toLocaleDateString(),
        time: item.appointment_time,
        amount: `${item.currency} ${item.amount}`,
        status: item.status === 'confirmed',
      }));
      setAppointmentData(transformed);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const addAppointment = async () => {
    try {
      await axios.post(`${BASE_URL}/appointment/book`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const toggleStatus = async (id) => {
    const updatedStatus = appointmentData.find((appt) => appt.id === id)?.status ? 'cancelled' : 'confirmed';
    try {
      await axios.put(`${BASE_URL}/appointment/update`, {
        appointment_id: id,
        status: updatedStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const totalPages = Math.ceil(appointmentData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentAppointments = appointmentData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <AdminLayout>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                  checked={typeof value === 'boolean' ? value : undefined}
                  value={typeof value !== 'boolean' ? value : undefined}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: typeof value === 'boolean' ? e.target.checked : e.target.value,
                    })
                  }
                  placeholder={key.replace(/_/g, ' ')}
                  className="border p-2 rounded"
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addAppointment}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 p-6">
        <div className="mb-5">
          <h2 className="text-3xl text-gray-900 mb-2">Appointments</h2>
          <p className="text-gray-600">Dashboard / Appointments</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </button>
          </div>

          {/* Table and Pagination remain unchanged, so keeping your code there as is */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speciality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img src={appt.doctorImg} alt={`${appt.doctorName}'s profile`} className="w-8 h-8 rounded-full object-cover mr-2" />
                      {appt.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.speciality}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <img src={appt.patientImg} alt={`${appt.patientName}'s profile`} className="w-8 h-8 rounded-full object-cover mr-2" />
                      {appt.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{appt.date}</div>
                      <div className="text-sky-500">{appt.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" checked={appt.status} onChange={() => toggleStatus(appt.id)} />
                        <div className={`relative w-10 h-5 rounded-full ${appt.status ? 'bg-green-400' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${appt.status ? 'translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, appointmentData.length)} of {appointmentData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">{currentPage}</span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentsManagement;
