import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Eye, Check, X } from 'lucide-react';
import DoctorLayout from '../../layouts/DoctorLayout';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/appointment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data?.status === 1) {
          const formatted = res.data.payload.data.map((item) => ({
            id: item.id,
            name: `${item.patient_fname} ${item.patient_lname}`,
            date: new Date(item.appointment_date).toLocaleDateString(),
            time: item.appointment_time,
            img: item.patient_profile_image || 'https://via.placeholder.com/80',
            location: `${item.patient_city || ''}, ${item.patient_country || 'India'}`,
            email: item.email || 'not-provided@example.com',
            phone: item.phone || '+91 XXXXXXXXXX',
            status: item.status,
          }));
          setAppointments(formatted);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, [token]);

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/appointment/update`,
        {
          appointment_id: id,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 1) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: newStatus } : appt
          )
        );
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-4 text-lg p-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between"
            >
              {/* Patient Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={appt.img}
                  alt={appt.name}
                  className="w-24 h-24 object-cover rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-xl text-gray-800">{appt.name}</h4>
                  <p className="text-gray-500">{appt.date}, {appt.time}</p>
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <FaMapMarkerAlt className="mr-1" /> {appt.location}
                  </div>
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <FaEnvelope className="mr-1" /> {appt.email}
                  </div>
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <FaPhone className="mr-1" /> {appt.phone}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button className="px-3 py-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded flex items-center space-x-1">
                  <Eye size={16} />
                  <span>View</span>
                </button>

                {appt.status !== 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                    className="px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded flex items-center space-x-1"
                  >
                    <Check size={16} />
                    <span>Accept</span>
                  </button>
                )}

                {appt.status !== 'cancelled' ? (
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                    className="px-3 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded flex items-center space-x-1"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1 text-gray-400 border border-gray-300 rounded cursor-not-allowed flex items-center space-x-1"
                  >
                    <X size={16} />
                    <span>Cancelled</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
