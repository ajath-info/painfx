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
  const [caregiverData, setCaregiverData] = useState(null);

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
    bookingFor: "self", // ✅ ADDED: New field for dropdown
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
          // Fetch caregiver data if available
          if (response.data?.payload?.caregiver) {
            setCaregiverData(response.data.payload.caregiver);
          }
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

  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setCaregiverData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCaregiver = async () => {
    if (!caregiverData?.name || !caregiverData?.phone || !caregiverData?.email || !caregiverData?.address_line1 || !caregiverData?.city || !caregiverData?.state || !caregiverData?.country || !caregiverData?.pin_code || !caregiverData?.relationship) {
      alert("Please fill all required caregiver fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      name: caregiverData.name,
      phone: caregiverData.phone,
      email: caregiverData.email,
      relationship: caregiverData.relationship,
      address_line1: caregiverData.address_line1,
      address_line2: caregiverData.address_line2 || "",
      city: caregiverData.city,
      state: caregiverData.state,
      country: caregiverData.country,
      pin_code: caregiverData.pin_code,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/caregiver/add-or-update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status === 1) {
        alert("Caregiver saved successfully!");
        // Optionally update caregiverData with any returned ID or data
        if (response.data?.payload?.id) {
          setCaregiverData((prev) => ({ ...prev, id: response.data.payload.id }));
        }
      } else {
        alert("Failed to save caregiver.");
      }
    } catch (error) {
      console.error("Error saving caregiver:", error);
      alert("Something went wrong while saving the caregiver.");
    }
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
    const userProfile = JSON.parse(localStorage.getItem("user") || '{}'); // Changed to 'user' key
    const userId = userProfile.id; // Fallback to 2 if user_id is not found
    const appointmentDate = selectedSlot?.day
      ? format(new Date(selectedSlot.day), "yyyy-MM-dd")
      : "";
    const parsedTime = selectedSlot?.time
      ? format(parse(selectedSlot.time, "h:mm a", new Date()), "HH:mm:ss")
      : "10:00:00";

    const payload = {
      user_id: userId,
      doctor_id: doctor?.id,
      consultation_type: formData.visitType === "clinic" ? "clinic_visit" : "home_visit",
      appointment_date: appointmentDate,
      appointment_time: parsedTime,
      appointment_type: "paid",
      payment_status: "unpaid",
      amount: doctor?.consultationFee?.toString() || "0.00",
      currency: "AUD",
      is_caregiver: formData.bookingFor === "caregiver",
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

    if (caregiverData) {
      payload.caregiver_id = caregiverData.id;
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
        const appointmentId = response.data?.payload?.appointment_id; // Assuming the API returns appointment_id
        if (!appointmentId) {
          alert("Appointment booked but no appointment ID received.");
          return;
        }
        navigate("/patient/payment-option", {
          state: {
            bookingData: {
              ...payload,
              appointment_id: appointmentId,
            },
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
        onChange={handleCaregiverChange}
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

            {/* ✅ Booking For Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Booking For</label>
              <select
                name="bookingFor"
                value={formData.bookingFor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              >
                <option value="self">Self</option>
                <option value="caregiver">Caregiver (Booking for someone else)</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FloatingInput name="firstName" label="First Name" value={formData.firstName} readOnly />
              <FloatingInput name="lastName" label="Last Name" value={formData.lastName} readOnly />
              <FloatingInput name="email" label="Email" type="email" value={formData.email} readOnly />
              <FloatingInput name="phone" label="Phone" type="tel" value={formData.phone} readOnly />
            </div>

            {/* Visit Type Dropdown */}
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

            {/* Clinic selection */}
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

            {/* Home address section */}
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

            {/* ✅ NEW: Caregiver form section */}
            {formData.bookingFor === "caregiver" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Caregiver Details</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={caregiverData?.name || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={caregiverData?.phone || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={caregiverData?.email || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Relationship</label>
                  <select
                    name="relationship"
                    value={caregiverData?.relationship || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="professional">Professional</option>
                    <option value="friend">Friend</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={caregiverData?.address_line1 || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={caregiverData?.address_line2 || ""}
                    onChange={handleCaregiverChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={caregiverData?.city || ""}
                      onChange={handleCaregiverChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={caregiverData?.state || ""}
                      onChange={handleCaregiverChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={caregiverData?.country || ""}
                      onChange={handleCaregiverChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                    <input
                      type="text"
                      name="pin_code"
                      value={caregiverData?.pin_code || ""}
                      onChange={handleCaregiverChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveCaregiver}
                  className="mt-4 px-6 py-2 text-white rounded font-semibold transition duration-300"
                  style={{ backgroundColor: "#0078FD" }}
                >
                  Save Caregiver
                </button>
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
                I have read and accept
                 {/* <a href="#" className="text-blue-600 underline">Terms & Conditions</a> */}
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

          {/* Booking Summary */}
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
              <p className="flex justify-between">
                <span className="font-bold text-lg">Time</span>
                <span className="text-lg">
                  {selectedSlot?.time
                    ? selectedSlot.time.includes(" - ")
                      ? selectedSlot.time // shows "9:00 AM - 9:30 AM"
                      : `${selectedSlot.time} - ${format(
                        new Date(new Date().setHours(
                          parseInt(selectedSlot.time),
                          30
                        )),
                        "h:mm a"
                      )}`
                    : "10:00 AM - 10:30 AM"}
                </span>
              </p>
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