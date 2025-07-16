import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000/api';

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState('doctors'); // 'doctors', 'slots', 'checkout'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctor/get-all-active-doctors`);
        const data = await response.json();
        if (data?.status === 1 && Array.isArray(data.payload)) {
          const formattedDoctors = data.payload.map((doc) => ({
            id: doc.id,
            name: `${doc.prefix} ${doc.f_name} ${doc.l_name}`,
            degree: doc.education?.map((e) => e.degree).join(', ') || 'N/A',
            specialty: doc.specialization?.map((s) => s.name).join(', ') || 'N/A',
            average_rating: doc.average_rating || 0,
            total_ratings: doc.total_ratings || 0,
            address: `${doc.city}, ${doc.state}, ${doc.country}`,
            rupee: `${doc.consultation_fee}`,
            availability: doc.next_available || 'Not Available',
            img: doc.profile_image,
            verified: true,
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const fetchAvailableSlots = async (doctorId) => {
    try {
      const response = await fetch(`${BASE_URL}/doctor/${doctorId}/available-slots`);
      const data = await response.json();
      if (data?.status === 1 && Array.isArray(data.payload)) {
        setAvailableSlots(data.payload);
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    }
  };

  const renderStars = (rating, totalRatings) => {
    const fullStars = Math.floor(rating);
    const maxStars = 5;
    return (
      <div className="flex items-center justify-center space-x-1 mb-2">
        <div className="flex space-x-1">
          {Array.from({ length: maxStars }, (_, i) => (
            <i
              key={i}
              className={`fa fa-star text-sm ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-2">({totalRatings})</span>
      </div>
    );
  };

  const formatPrice = (price) => {
    if (!price || price === 'N/A') return 'Price on request';
    return `$${price} - $${parseInt(price) + 200}`;
  };

  const bookAppointment = async (doctorId) => {
    setSelectedDoctor(doctors.find(doc => doc.id === doctorId));
    await fetchAvailableSlots(doctorId);
    setCurrentStep('slots');
  };

  const selectSlot = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep('checkout');
  };

  const confirmPayment = async () => {
    try {
      const patientBearerToken = localStorage.getItem('patientBearerToken');
      if (!patientBearerToken) {
        alert('Please log in to book an appointment.');
        return;
      }

      const appointmentData = {
        user_id: 2,
        doctor_id: selectedDoctor.id,
        appointment_date: selectedSlot.date,
        appointment_time: selectedSlot.time,
        consultation_type: "home_visit",
        appointment_type: "paid",
        payment_status: "paid",
        amount: "299.99",
        currency: "AUD",
        address_line1: "12-A, Palm Avenue",
        address_line2: "Near XYZ Mall",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        pin_code: "400001",
        is_caregiver: false
      };

      const response = await fetch(`${BASE_URL}/appointment/book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${patientBearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      if (result?.status === 1) {
        alert('Appointment booked successfully!');
        setCurrentStep('doctors');
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking the appointment.');
    }
  };

  if (currentStep === 'slots') {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Select Available Slot for {selectedDoctor.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <button
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => selectSlot(slot)}
                >
                  <p>Date: {slot.date}</p>
                  <p>Time: {slot.time}</p>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500">No slots available.</p>
            )}
          </div>
          <button
            className="mt-4 bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            onClick={() => setCurrentStep('doctors')}
          >
            Back
          </button>
        </div>
      </section>
    );
  }

  if (currentStep === 'checkout') {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Checkout for {selectedDoctor.name}</h1>
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input type="radio" name="payment" className="mr-2" defaultChecked />
                    Credit Card
                  </label>
                </div>
                <input type="text" placeholder="Name on Card" className="w-full p-2 mb-2 border rounded" />
                <input type="text" placeholder="Card Number" className="w-full p-2 mb-2 border rounded" />
                <div className="flex space-x-2">
                  <input type="text" placeholder="Expiry Month" className="w-1/3 p-2 mb-2 border rounded" />
                  <input type="text" placeholder="Expiry Year" className="w-1/3 p-2 mb-2 border rounded" />
                  <input type="text" placeholder="CVV" className="w-1/3 p-2 mb-2 border rounded" />
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  onClick={confirmPayment}
                >
                  Confirm and Pay
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                <p>Doctor: {selectedDoctor.name}</p>
                <p>Date: {selectedSlot.date}</p>
                <p>Time: {selectedSlot.time}</p>
                <p>Consulting Fee: $100</p>
                <p>Booking Fee: $10</p>
                <p>Video Call: $50</p>
                <p className="font-bold mt-4">Total: $160</p>
              </div>
            </div>
          </div>
          <button
            className="mt-4 bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            onClick={() => setCurrentStep('slots')}
          >
            Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12">
          <div className="lg:w-2/5 mb-8 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Book Our Doctor
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Lorem Ipsum is simply dummy text
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many
              web sites still in their infancy. Various versions have evolved over the years, sometimes
            </p>
            <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Read More..
            </button>
          </div>
          <div className="lg:w-3/5 flex-1">
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {doctors.length > 0 ? (
                doctors.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex-none w-80"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {doc.verified && (
                        <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 text-center">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1 text-center">
                        {doc.degree}
                      </p>
                      <p className="text-sm text-gray-600 mb-3 text-center">
                        - {doc.specialty}
                      </p>
                      {renderStars(doc.average_rating, doc.total_ratings)}
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                        <i className="fa-solid fa-location-dot mr-2"></i>
                        <span>{doc.address}</span>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                        <i className="fa-solid fa-clock mr-2"></i>
                        <span>{doc.availability}</span>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                        <i className="fa-solid fa-dollar-sign mr-2"></i>
                        <span>{formatPrice(doc.rupee)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                          View Profile
                        </button>
                        <button
                          className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                          onClick={() => bookAppointment(doc.id)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12 w-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading doctors...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;