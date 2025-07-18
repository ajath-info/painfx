import React, { useEffect, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import axios from 'axios';
import BASE_URL from '../../config';



const PatientCards = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/patient/doctor-patients?page=1&limit=8`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 1) {
          setPatients(response.data.payload.data);
        }
      } catch (error) {
        console.error('Error fetching patient list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);

  return (
    <DoctorLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No patients found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {patients.map((patient, index) => {
              const age = new Date().getFullYear() - new Date(patient.DOB).getFullYear();
              const profileImage =
                patient.profile_image || 'https://via.placeholder.com/100x100.png?text=User';

              return (
                <div
                  key={patient.patient_id || index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
                >
                  <div className="text-center">
                    <img
                      src={profileImage}
                      alt={`Portrait of ${patient.full_name}`}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{patient.full_name}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Patient ID: <span className="text-gray-700">{`P-${patient.patient_id}`}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {patient.city}, {patient.state || ''}, {patient.country || ''}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm mt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Phone:</span>
                      <span className="text-gray-600">
                        {patient.phone_code} {patient.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Age/Gender:</span>
                      <span className="text-gray-600">
                        {age} yrs, {patient.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Last Visit:</span>
                      <span className="text-gray-600">
                        {new Date(patient.last_appointment_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default PatientCards;
