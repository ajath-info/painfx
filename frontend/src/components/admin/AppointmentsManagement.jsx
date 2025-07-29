import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import BASE_URL from '../../config';
import Loader from '../common/Loader';
import { useNavigate } from 'react-router-dom';

// ✅ Replace hardcoded token with localStorage
const token = localStorage.getItem('token');
const currencySymbols = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  AUD: '$',
  CAD: '$',
  JPY: '¥',
};

// Helper function to convert 24h time to 12h with AM/PM
const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date(1970, 0, 1, hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
};

const AppointmentsManagement = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    consultation_type: '',
    appointment_type: '',
    payment_status: 'unpaid',
    amount: '',
    currency: 'AUD',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
    is_caregiver: false,
    selectedClinicId: '',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [slots, setSlots] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data.payload?.data || [];
      const transformed = payload.map(item => ({
        id: item.id,
        doctorName: `Dr. ${item.doctor_fname} ${item.doctor_lname}`,
        doctorImg: 'https://picsum.photos/id/259/50/50',
        speciality: item.specializations.length > 0 ? item.specializations[0].name : 'Not Available',
        patientName: `${item.patient_fname} ${item.patient_lname}`,
        patientImg: 'https://picsum.photos/id/260/50/50',
        date: new Date(item.appointment_date).toLocaleDateString(),
        time: new Date(`1970-01-01T${item.appointment_time}Z`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        amount: `${currencySymbols[item.currency] || item.currency} ${item.amount}`,
        status: item.status === 'confirmed',
      }));
      setAppointmentData(transformed);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointmentData([]);
    }
  };

  const fetchPatients = async (name = '') => {
    try {
      const res = await axios.get(`${BASE_URL}/user/all?role=patient&status=1${name ? `&name=${name}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientList = res.data.payload?.users || [];
      setPatients(patientList.map(patient => ({
        id: patient.id,
        name: patient.full_name || `${patient.f_name} ${patient.l_name}`,
      })));
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/get-all-active-doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctorList = res.data.payload || [];
      setDoctors(doctorList.map(doctor => ({
        id: doctor.doctor_id,
        name: `${doctor.prefix} ${doctor.f_name} ${doctor.l_name}`,
        consultation_fee: doctor.consultation_fee,
        appointment_type: doctor.consultation_fee_type,
      })));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const fetchClinicsByDoctor = async (doctorId) => {
    try {
      console.log('Fetching clinics for doctorId:', doctorId);
      const res = await axios.get(`${BASE_URL}/clinic/get-mapped-clinics?doctor_id=${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Clinics response:', res.data);
      setClinics(res.data.payload || []);
      setFormData(prev => ({ ...prev, selectedClinicId: '' }));
    } catch (error) {
      console.error('Error fetching clinics:', error);
      setClinics([]);
    }
  };

  const fetchAvailability = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const res = await axios.get(`${BASE_URL}/availability/get-availability-by-date?doctor_id=${doctorId}&date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Availability Response:', res.data);
      const availableSlots = res.data.payload?.slots.filter(slot => !slot.isBooked).map(slot => ({
        value: slot.from,
        label: `${formatTime(slot.from)} to ${formatTime(slot.to)}`,
      })) || [];
      setSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setSlots([]);
    }
  };

  const addAppointment = async () => {
    try {
      const payload = {
        user_id: 2, // Hardcoded as per correct payload
        doctor_id: parseInt(formData.doctor_id),
        caregiver_id: parseInt(formData.caregiver_id) || 2,
        consultation_type: formData.consultation_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time + ':00', // Ensure time includes seconds
        appointment_type: formData.appointment_type,
        payment_status: formData.payment_status,
        amount: formData.amount,
        currency: formData.currency,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pin_code: formData.pin_code,
        is_caregiver: formData.is_caregiver,
      };
      console.log('Sending payload:', payload); // Debug log
      await axios.post(`${BASE_URL}/appointment/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error.response ? error.response.data : error.message);
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

  const handleViewAppointment = (appt) => {
    navigate('/admin/appointment/details', { state: { id: appt.id } });
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
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchPatients(), fetchDoctors()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (formData.doctor_id) {
      fetchClinicsByDoctor(formData.doctor_id);
      const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctor_id));
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          amount: selectedDoctor.consultation_fee,
          appointment_type: selectedDoctor.appointment_type,
          payment_status: selectedDoctor.appointment_type === 'paid' ? 'unpaid' : 'free',
        }));
      }
    } else {
      setClinics([]);
      setFormData(prev => ({
        ...prev,
        amount: '',
        appointment_type: '',
        payment_status: 'unpaid',
      }));
    }
  }, [formData.doctor_id, doctors]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, appointment_date: date });
    if (formData.doctor_id) {
      fetchAvailability(formData.doctor_id, date);
    }
  };

  const handleConsultationTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      consultation_type: type,
      address_line1: type === 'home_visit' ? prev.address_line1 : '',
      address_line2: type === 'home_visit' ? prev.address_line2 : '',
      city: type === 'home_visit' ? prev.city : '',
      state: type === 'home_visit' ? prev.state : '',
      country: type === 'home_visit' ? prev.country : '',
      pin_code: type === 'home_visit' ? prev.pin_code : '',
      selectedClinicId: type === 'clinic_visit' ? prev.selectedClinicId : '',
    }));
  };

  const handleClinicChange = (e) => {
    const clinicId = e.target.value;
    setFormData(prev => {
      const selectedClinic = clinics.find(c => c.id === parseInt(clinicId));
      return {
        ...prev,
        selectedClinicId: clinicId,
        address_line1: selectedClinic ? selectedClinic.address_line1 || '' : '',
        address_line2: selectedClinic ? selectedClinic.address_line2 || '' : '',
        city: selectedClinic ? selectedClinic.city || '' : '',
        state: selectedClinic ? selectedClinic.state || '' : '',
        country: selectedClinic ? selectedClinic.country || '' : '',
        pin_code: selectedClinic ? selectedClinic.pin_code || '' : '',
      };
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AdminLayout>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                if (key === 'patient_name') {
                  return (
                    <select
                      key={key}
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.name}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  );
                }
                if (key === 'doctor_id') {
                  return (
                    <select
                      key={key}
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  );
                }
                if (key === 'appointment_date') {
                  return (
                    <input
                      key={key}
                      type="date"
                      value={formData.appointment_date}
                      onChange={handleDateChange}
                      className="border p-2 rounded"
                    />
                  );
                }
                if (key === 'appointment_time') {
                  return (
                    <select
                      key={key}
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Time Slot</option>
                      {slots.map((slot, index) => (
                        <option key={index} value={slot.value.split(':')[0] + ':' + slot.value.split(':')[1]}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  );
                }
                if (key === 'consultation_type') {
                  return (
                    <select
                      key={key}
                      value={formData.consultation_type}
                      onChange={handleConsultationTypeChange}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Consultation Type</option>
                      <option value="home_visit">Home Visit</option>
                      <option value="clinic_visit">Clinic</option>
                    </select>
                  );
                }
                if (key === 'selectedClinicId' && formData.consultation_type === 'clinic_visit' && clinics.length > 0) {
                  return (
                    <select
                      key={key}
                      value={formData.selectedClinicId}
                      onChange={handleClinicChange}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Clinic</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  );
                }
                if (key === 'appointment_type') {
                  return (
                    <select
                      key={key}
                      value={formData.appointment_type}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Appointment Type</option>
                      <option value="paid">Paid</option>
                      <option value="free">Free</option>
                    </select>
                  );
                }
                if (key === 'amount') {
                  return (
                    <input
                      key={key}
                      type="text"
                      value={value}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder="Amount"
                      className="border p-2 rounded"
                    />
                  );
                }
                if (['address_line1', 'address_line2', 'city', 'state', 'country', 'pin_code'].includes(key)) {
                  const isDisabled = formData.consultation_type === 'clinic_visit' && formData.selectedClinicId;
                  return (
                    <input
                      key={key}
                      type="text"
                      value={value}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={key.replace(/_/g, ' ')}
                      disabled={isDisabled}
                      className="border p-2 rounded"
                    />
                  );
                }
                return (
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
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="border border-cyan-500 text-cyan-500 px-4 py-2 rounded cursor-pointer hover:bg-cyan-500 hover:text-white " onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="bg-cyan-500 text-white px-4 py-2 rounded cursor-pointer" onClick={addAppointment}>
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
              onClick={() => {
                setShowForm(true);
                fetchPatients(searchName);
              }}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center gap-1 sm:gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Add New</span>
            </button>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleViewAppointment(appt)}
                        className="px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded shadow flex items-center space-x-1"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, appointmentData.length)} of {appointmentData.length} entries
            </div>
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-cyan-500 rounded text-xs sm:text-sm text-cyan-500 hover:bg-cyan-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline ">Previous</span>
              </button>
              <span className="px-3 py-1 sm:py-1.5 bg-cyan-500 text-white rounded text-xs sm:text-sm min-w-[36px] text-center">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-cyan-500 rounded text-xs sm:text-sm text-cyan-500 hover:bg-cyan-500 hover:text-white hover:bg-cyan-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentsManagement;