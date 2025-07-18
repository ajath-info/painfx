import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import DoctorImage from "../../images/dentist.png";
import BASE_URL from '../../config';



const BookingForm = () => {
  const location = useLocation();
  const { doctor, selectedSlot } = location.state || {};
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nameOnCard: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    paymentMethod: "card",
    acceptedTerms: false,
    visitType: "clinic",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    clinicId: "",
  });

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/clinic/get-mapped-clinics?doctor_id=${doctor?.id}`
        );
        if (response.data?.payload) {
          setClinics(response.data.payload);
          setFormData((prev) => ({
            ...prev,
            clinicId: response.data.payload[0]?.id || "",
          }));
          setSelectedClinic(response.data.payload[0] || null);
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    if (doctor?.id && formData.visitType === "clinic") {
      fetchClinics();
    }
  }, [doctor?.id, formData.visitType]);

  useEffect(() => {
    const clinic = clinics.find((c) => c.id === Number(formData.clinicId));
    setSelectedClinic(clinic || null);
  }, [formData.clinicId, clinics]);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/user/patient-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.payload?.patient) {
          const patient = response.data.payload.patient;
          setFormData((prev) => ({
            ...prev,
            firstName: patient.f_name || "",
            lastName: patient.l_name || "",
            email: patient.email || "",
            phone: patient.phone || "",
            addressLine1: patient.address_line1 || "",
            addressLine2: patient.address_line2 || "",
            city: patient.city || "",
            state: patient.state || "",
            zipCode: patient.pin_code || "",
            country: patient.country || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    };

    fetchPatientProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (formData.visitType === "home") {
      const requiredFields = [
        "addressLine1",
        "city",
        "state",
        "zipCode",
        "country",
      ];
      const missing = requiredFields.find((field) => !formData[field]?.trim());
      if (missing) {
        alert("Please fill all required address fields for home visit.");
        return;
      }
    }

    const token = localStorage.getItem("token");
    const appointmentDate = selectedSlot?.day
      ? format(new Date(selectedSlot.day), "yyyy-MM-dd")
      : "";

    const parsedTime = selectedSlot?.time
      ? format(parse(selectedSlot.time, "h:mm a", new Date()), "HH:mm:ss")
      : "10:00:00";

    const payload = {
      user_id: doctor?.user_id || 2, // replace with real user_id if needed
      doctor_id: doctor?.id,
      consultation_type: formData.visitType === "clinic" ? "clinic_visit" : "home_visit",
      appointment_date: appointmentDate,
      appointment_time: parsedTime,
      appointment_type: "paid",
      payment_status: "unpaid",
      amount: doctor?.consultationFee?.toString() || "0.00",
      currency: "AUD",
      is_caregiver: false,
    };

    if (formData.visitType === "home") {
      payload.address_line1 = formData.addressLine1;
      payload.address_line2 = formData.addressLine2;
      payload.city = formData.city;
      payload.state = formData.state;
      payload.country = formData.country;
      payload.pin_code = formData.zipCode;
    } else {
      payload.clinic_id = formData.clinicId;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/appointment/book`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status === 1) {
        // alert("Appointment booked successfully!");

        // Navigate to payment option page with booking data
        navigate("/patient/payment-option", {
          state: {
            bookingData: payload, // Send booking data to next page
          },
        });
      } else {
        alert("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong while booking the appointment.");
    }
  };

  const FloatingInput = ({ name, label, type = "text", value, readOnly = false }) => (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder=" "
        readOnly={readOnly}
        className={`peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09DCA4] ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );

  const formattedDate = selectedSlot?.day
    ? format(new Date(selectedSlot.day), "dd MMM yyyy")
    : "16 Nov 2019";

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-6 bg-white p-6 shadow border border-gray-200 rounded"
          >
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <FloatingInput name="firstName" label="First Name" value={formData.firstName} />
              <FloatingInput name="lastName" label="Last Name" value={formData.lastName} />
              <FloatingInput name="email" label="Email" type="email" value={formData.email} />
              <FloatingInput name="phone" label="Phone" type="tel" value={formData.phone} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Visit Type</label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              >
                <option value="clinic">Clinic Visit</option>
                <option value="home">Home Visit</option>
              </select>
            </div>

            {formData.visitType === "clinic" && clinics.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Clinic</label>
                <select
                  name="clinicId"
                  value={formData.clinicId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                >
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name} ({clinic.city})
                    </option>
                  ))}
                </select>

                {selectedClinic && (
                  <div className="mt-4 text-sm text-gray-600 border border-gray-200 p-3 rounded bg-gray-50">
                    <p className="font-semibold text-base text-gray-700">{selectedClinic.name}</p>
                    <p>{selectedClinic.address_line1}</p>
                    {selectedClinic.address_line2 && <p>{selectedClinic.address_line2}</p>}
                    <p>{selectedClinic.city}, {selectedClinic.state}</p>
                    <p>{selectedClinic.country} - {selectedClinic.pin_code}</p>
                  </div>
                )}
              </div>
            )}

            {formData.visitType === "home" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Home Address</h3>
                <FloatingInput name="addressLine1" label="Address Line 1" value={formData.addressLine1} />
                <FloatingInput name="addressLine2" label="Address Line 2" value={formData.addressLine2} />
                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingInput name="city" label="City" value={formData.city} />
                  <FloatingInput name="state" label="State" value={formData.state} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingInput name="zipCode" label="Zip Code" value={formData.zipCode} />
                  <FloatingInput name="country" label="Country" value={formData.country} />
                </div>
              </div>
            )}

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
              />
              <span className="text-lg">
                I have read and accept <a href="#" className="text-blue-600 underline">Terms & Conditions</a>
              </span>
            </label>

            <button
              type="submit"
              className="px-6 text-xl py-3 text-white rounded font-semibold transition duration-300"
              style={{ backgroundColor: "#0078FD" }}
            >
              Confirm Booking
            </button>
          </form>

          <div className="bg-white shadow rounded p-8 border border-gray-200 h-fit">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <div className="flex items-center space-x-4">
              <img src={doctor?.image || DoctorImage} alt="Doctor" className="rounded w-28 h-30 object-cover" />
              <div>
                <h3 className="font-bold text-xl">{doctor?.name || "Dr. Darren Elder"}</h3>
                <div className="text-yellow-500 text-lg">
                  {"★".repeat(Math.floor(doctor?.rating || 4))}
                  {"☆".repeat(5 - Math.floor(doctor?.rating || 4))}
                  <span className="text-sm text-gray-600 ml-2">{doctor?.reviews || 35}</span>
                </div>
                <p className="text-gray-500 text-sm">📍 {doctor?.location || "Newyork, USA"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <p className="flex justify-between"><span className="font-bold text-lg">Date</span><span className="text-lg">{formattedDate}</span></p>
              <p className="flex justify-between"><span className="font-bold text-lg">Time</span><span className="text-lg">{selectedSlot?.time || "10:00 AM"}</span></p>
              <p className="flex justify-between"><span className="font-bold text-lg">Consulting Fee</span><span className="text-lg">${doctor?.consultationFee || 100}</span></p>
              <hr />
              <p className="flex justify-between font-bold text-[#0078FD]">
                <span className="font-bold text-lg">Total</span>
                <span className="text-lg">${doctor?.consultationFee || 100}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingForm;
