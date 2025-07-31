import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PatientLayout from "../../layouts/AdminLayout";
import BASE_URL from "../../config";
import { formatTimeToAMPM, getStatusStyles } from "../patient/PatientDashboard";
import Loader from "../common/Loader";

const AppointmentDetails = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || null;
  const appointmentId = location.state?.id;
  console.log("Appointment ID from state:", appointmentId);

  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in.");
      navigate("/login", { replace: true });
      return;
    }

    const fetchAppointmentDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/appointment/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appt = response?.data?.payload;
        if (!appt) {
          setError("Appointment not found.");
          return;
        }

        // Transform consultation_type to user-friendly format
        const formatConsultationType = (type) => {
          if (type === "clinic_visit") return "Clinic Visit";
          if (type === "home_visit") return "Home Visit";
          return ".........";
        };

        const mappedAppointment = {
          id: appt.id,
          doctor: `${appt.doctor_prefix || ""} ${appt.doctor_fname || ""} ${appt.doctor_lname || ""}`.trim() || "Unknown",
          specialization: appt.specializations?.[0]?.name || ".........",
          date: appt.appointment_date
            ? new Date(appt.appointment_date).toLocaleDateString()
            : "..........",
          time: formatTimeToAMPM(appt.appointment_time),
          bookingDate: appt.created_at
            ? new Date(appt.created_at).toLocaleDateString()
            : "..........",
          amount: `${appt.currency === "AUD" ? "AUD" : "AUD"} ${appt.amount || 0}`,
          status: appt.status || "Pending",
          consultationType: formatConsultationType(appt.consultation_type),
          appointmentType: appt.appointment_type || ".........",
          paymentStatus: appt.payment_status || ".........",
          patientName: `${appt.patient_fname || ""} ${appt.patient_lname || ""}`.trim() || "Unknown",
          patientEmail: appt.patient_email || ".........",
          patientPhone: `${appt.patient_phone_code || ""}${appt.patient_phone || ""}` || ".........",
          clinicAddress: appt.resolved_address
            ? `${appt.resolved_address.line1}, ${appt.resolved_address.line2}, ${appt.resolved_address.city}, ${appt.resolved_address.state}, ${appt.resolved_address.country} - ${appt.resolved_address.pin_code}`
            : ".........",
          resolvedAddress: appt.resolved_address
            ? `${appt.resolved_address.line1}, ${appt.resolved_address.line2}, ${appt.resolved_address.city}, ${appt.resolved_address.state}, ${appt.resolved_address.country} - ${appt.resolved_address.pin_code}`
            : ".........",
          doctorImg: appt.doctor_profile_image || "https://via.placeholder.com/100x100?text=No+Image",
          patientImg: appt.patient_profile_image || "https://via.placeholder.com/100x100?text=No+Image",
        };

        setAppointment(mappedAppointment);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    } else {
      setError("No appointment ID provided.");
      setLoading(false);
    }
  }, [appointmentId, userId, token, navigate]);

  if (loading){
    return <Loader/>
  }
  if (error) return <div className="p-4 text-red-500 text-lg">{error}</div>;
  if (!appointment) return <div className="p-4 text-gray-600 text-lg">No appointment details available.</div>;

  return (
    <PatientLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Appointment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Information */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Doctor Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={appointment.doctorImg}
                  alt={appointment.doctor}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">{appointment.doctor}</p>
                  <p className="text-gray-600">{appointment.specialization}</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Patient Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={appointment.patientImg}
                  alt={appointment.patientName}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">{appointment.patientName}</p>
                  <p className="text-gray-600">{appointment.patientEmail}</p>
                  <p className="text-gray-600">{appointment.patientPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="border border-gray-200 rounded-lg p-4 mt-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Appointment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {/* <p className="text-gray-600"><strong>Appointment ID:</strong> {appointment.id}</p> */}
                <p className="text-gray-600"><strong>Date:</strong> {appointment.date}</p>
                <p className="text-gray-600"><strong>Time:</strong> {appointment.time}</p>
                <p className="text-gray-600"><strong>Booking Date:</strong> {appointment.bookingDate}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Consultation Type:</strong> {appointment.consultationType}</p>
                <p className="text-gray-600"><strong>Appointment Type:</strong> {appointment.appointmentType}</p>
                <p className="text-gray-600"><strong>Amount:</strong> {appointment.amount}</p>
                <p className="text-gray-600"><strong>Payment Status:</strong> {appointment.paymentStatus}</p>
                <p className="text-gray-600">
                  <strong>Appointment Status:</strong>{" "}
                  <span
                    className={(appointment.status)}
                  >
                    {appointment.status}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-4"><strong>Clinic Address:</strong> {appointment.clinicAddress}</p>
            <p className="text-gray-600 mt-2"><strong>Appointment Address:</strong> {appointment.resolvedAddress}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-md hover:bg-cyan-500 hover:text-white transition cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default AppointmentDetails;