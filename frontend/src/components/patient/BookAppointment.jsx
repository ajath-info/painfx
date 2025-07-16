import React, { useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import DoctorImage from "../../images/dentist.png";

const BookingForm = () => {
  // Sample data to simulate backend API
  const doctors = [
    {
      id: 1,
      name: "Dr. Darren Elder",
      image: DoctorImage,
      role: "Dentist",
      rating: 4,
      reviewCount: 35,
      location: "Newyork, USA",
      date: "16 Nov 2019",
      time: "10:00 AM",
      consultingFee: 100,
      bookingFee: 10,
      videoCallFee: 50,
    },
  ];

  const doctor = doctors[0]; // Assume selecting the first doctor

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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    const bookingDetails = {
      ...formData,
      doctor: {
        name: doctor.name,
        role: doctor.role,
        date: doctor.date,
        time: doctor.time,
        total: doctor.consultingFee + doctor.bookingFee + doctor.videoCallFee,
      },
    };

    console.log("Booking Info:", bookingDetails);
  };

  const FloatingInput = ({ name, label, type = "text", value }) => (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09DCA4]"
      />
      <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-6 bg-white p-6 shadow border border-gray-200 rounded"
          >
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <FloatingInput
                name="firstName"
                label="First Name"
                value={formData.firstName}
              />
              <FloatingInput
                name="lastName"
                label="Last Name"
                value={formData.lastName}
              />
              <FloatingInput
                name="email"
                label="Email"
                type="email"
                value={formData.email}
              />
              <FloatingInput
                name="phone"
                label="Phone"
                type="tel"
                value={formData.phone}
              />
            </div>
            <p className="text-lg">
              Existing Customer?{" "}
              <a href="#" className="text-blue-600 underline">
                Click here to login
              </a>
            </p>

            <h2 className="text-2xl font-bold mt-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  className="w-5 h-5 "
                />
                <span className="font-semibold">Credit Card</span>
              </label>

              {formData.paymentMethod === "card" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingInput
                    name="nameOnCard"
                    label="Name on Card"
                    value={formData.nameOnCard}
                  />
                  <FloatingInput
                    name="cardNumber"
                    label="Card Number"
                    value={formData.cardNumber}
                  />
                  <FloatingInput
                    name="expiryMonth"
                    label="Expiry Month"
                    value={formData.expiryMonth}
                  />
                  <FloatingInput
                    name="expiryYear"
                    label="Expiry Year"
                    value={formData.expiryYear}
                  />
                  <FloatingInput name="cvv" label="CVV" value={formData.cvv} />
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="font-semibold">Paypal</span>
              </label>
            </div>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
              />
              <span className="text-lg">
                I have read and accept{" "}
                <a href="#" className="text-blue-600 underline">
                  Terms & Conditions
                </a>
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

          {/* Booking Summary Section */}
          <div className="bg-white shadow rounded p-8 border border-gray-200 h-fit">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <div className="flex items-center space-x-4">
              <img
                src={doctor.image}
                alt="Doctor"
                className="rounded w-28 h-30 object-cover"
              />
              <div>
                <h3 className="font-bold text-xl">{doctor.name}</h3>
                <div className="text-yellow-500 text-lg">
                  {"★".repeat(doctor.rating)}
                  {"☆".repeat(5 - doctor.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {doctor.reviewCount}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">📍 {doctor.location}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <p className="flex justify-between">
                <span className="font-bold text-lg">Date</span>
                <span className="text-lg">{doctor.date}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-lg">Time</span>
                <span className="text-lg">{doctor.time}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-lg">Consulting Fee</span>
                <span className="text-lg">${doctor.consultingFee}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-lg">Booking Fee</span>
                <span className="text-lg">${doctor.bookingFee}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-lg">Video Call</span>
                <span className="text-lg">${doctor.videoCallFee}</span>
              </p>
              <hr />
              <p className="flex justify-between font-bold text-[#0078FD]">
                <span className="font-bold text-lg">Total</span>
                <span className="text-lg">
                  $
                  {doctor.consultingFee +
                    doctor.bookingFee +
                    doctor.videoCallFee}
                </span>
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