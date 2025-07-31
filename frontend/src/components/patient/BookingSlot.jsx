import React, { useState, useEffect, useRef } from "react";
import { addDays, format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Doctorimage from "../../images/dentist.webp";
import BASE_URL from "../../config";
import Loader from "../common/Loader";
import Scrolltop from "../common/Scrolltop";

const DoctorAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({}); // Store slots by date
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // Default to current date: 2025-07-16
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateOffset, setDateOffset] = useState(0); // For scrolling dates
  const [bookedSlots, setBookedSlots] = useState(new Set()); // Track booked slots
  const dateScrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // New state for doctor data fetched from API
  const [doctor, setDoctor] = useState(null);

  // Get doctorId from query parameter or location state
  const searchParams = new URLSearchParams(location.search);
  const doctorIdFromQuery =
    searchParams.get("doctorId") || location.state?.doctor?.id;

  // Fetch doctor profile from API
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/user/doctor-profile?id=${doctorIdFromQuery}`
        );
        if (response.data.status === 1 && response.data.payload?.doctor) {
          const doctorData = response.data.payload.doctor;
          setDoctor({
            id: doctorData.id,
            name: `${doctorData.prefix} ${doctorData.f_name} ${doctorData.l_name}`,
            rating:
              response.data.payload.ratings.reduce(
                (sum, r) => sum + parseFloat(r.rating || 0),
                0
              ) / response.data.payload.ratings.length || 0,
            reviews: response.data.payload.ratings.length,
            location: [doctorData.city, doctorData.state, doctorData.country]
              .filter(Boolean)
              .join(", "),
            image: doctorData.profile_image || Doctorimage,
            consultationFee: doctorData.consultation_fee,
            nextAvailable:
              response.data.payload.availability.length > 0
                ? "Available"
                : "Not Available",
          });
        } else {
          throw new Error("Invalid response structure or status");
        }
      } catch (err) {
        console.error(
          "Error fetching doctor profile:",
          err.response?.data || err.message
        );
        setError("Failed to fetch doctor profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorIdFromQuery]);

  // Generate days starting from today + offset for scrolling
  const generateDays = (offset = 0) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(new Date(), offset + i);
      return {
        label: format(date, "EEE"),
        dateStr: format(date, "dd MMM yyyy"),
        fullDate: format(date, "yyyy-MM-dd"),
      };
    });
  };

  const [days, setDays] = useState(generateDays(dateOffset));

  // Update days when dateOffset changes
  useEffect(() => {
    setDays(generateDays(dateOffset));
  }, [dateOffset]);

  // Scroll functions for dates
  const scrollLeft = () => {
    if (dateOffset > 0) {
      setDateOffset((prev) => prev - 1);
    }
  };

  const scrollRight = () => {
    setDateOffset((prev) => prev + 1);
  };

  // Fetch available slots for the selected date
  useEffect(() => {
    setLoading(true); // Show loader before any checks or API calls
    if (!doctor?.id) {
      setLoading(true);
      console.error("No doctor ID found");
      return;
    }

    const fetchSlots = async () => {
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/availability/get-availability-by-date`,
          {
            params: { doctor_id: doctor.id, date: selectedDate },
          }
        );
        console.log(`API Response for ${selectedDate}:`, response.data);

        const slotsByDate = {};
        const bookedSlotsSet = new Set();

        if (response.data.status === 1 && response.data.payload?.slots) {
          const allSlots = response.data.payload.slots.map((slot) => ({
            time: formatTime(slot.from),
            from: slot.from,
            to: slot.to,
            isBooked: slot.isBooked,
          }));

          // Separate booked and available slots
          const availableSlots = allSlots.filter((slot) => !slot.isBooked);
          const bookedSlots = allSlots.filter((slot) => slot.isBooked);

          // Add booked slots to the set for tracking
          bookedSlots.forEach((slot) => {
            bookedSlotsSet.add(`${selectedDate}-${slot.time}`);
          });

          // Store all slots (both available and booked) for display
          slotsByDate[selectedDate] = allSlots;
        }

        console.log("Available Slots State:", slotsByDate);
        console.log("Booked Slots:", bookedSlotsSet);

        setAvailableSlots(slotsByDate);
        setBookedSlots(bookedSlotsSet);
      } catch (err) {
        setError(
          "Failed to fetch available slots. Please check the API or try again later."
        );
        console.error(
          "Error fetching slots:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctor?.id, selectedDate]);

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date(2025, 6, 16, hours, minutes);
    return format(date, "h:mm a");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
    console.log("Selected Date Changed to:", date);
  };

  const handleSlotSelect = (day, time, slot) => {
    if (slot.isBooked) {
      return; // Don't allow selection of booked slots
    }
    setSelectedSlot({ day, time });
    console.log("Selected Slot:", { day, time });
  };

  // Handle returning from login page
  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      try {
        const booking = JSON.parse(pendingBooking);
        const isLoggedIn = checkAuthStatus();

        if (isLoggedIn && booking.selectedSlot && booking.doctorId) {
          // Clear the pending booking
          localStorage.removeItem("pendingBooking");

          // Navigate to booking page with the stored data
          navigate("/patient/book-appointment", {
            state: {
              doctor: doctor || {},
              selectedSlot,
            },
          });
        }
      } catch (error) {
        console.error("Error parsing pending booking:", error);
        localStorage.removeItem("pendingBooking");
      }
    }
  }, [navigate]);

  // Check if patient is logged in
  const checkAuthStatus = () => {
    // Check multiple possible storage locations for auth token
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("userToken");

    // Also check for user data in localStorage
    const userData =
      localStorage.getItem("userData") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("userData") ||
      sessionStorage.getItem("user");

    return token || userData;
  };

  const handleProceedToPay = async () => {
    if (selectedSlot) {
      const isLoggedIn = checkAuthStatus();

      if (!isLoggedIn) {
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            selectedSlot,
            doctorId: doctor?.id,
            returnUrl: window.location.pathname + window.location.search,
          })
        );
        navigate("/login");
        return;
      }

      try {
        const slotKey = `${selectedSlot.day}-${selectedSlot.time}`;
        setBookedSlots((prev) => new Set([...prev, slotKey]));

        setAvailableSlots((prev) => {
          const updated = { ...prev };
          if (updated[selectedSlot.day]) {
            updated[selectedSlot.day] = updated[selectedSlot.day].map((slot) =>
              slot.time === selectedSlot.time
                ? { ...slot, isBooked: true }
                : slot
            );
          }
          return updated;
        });

        setSelectedSlot(null);

        // Pass doctor and selectedSlot data
        navigate("/patient/book-appointment", {
          state: {
            doctor: {
              id: doctor?.id,
              name: doctor?.name,
              role: doctor?.role || "Dentist",
              rating: doctor?.rating,
              reviews: doctor?.reviews,
              location: doctor?.location,
              image: doctor?.image,
              consultationFee: doctor?.consultationFee, // Default fee
              nextAvailable: doctor?.nextAvailable,
            },
            selectedSlot: {
              day: selectedSlot.day,
              time: selectedSlot.time,
            },
          },
        });
      } catch (error) {
        console.error("Error booking slot:", error);
        const slotKey = `${selectedSlot.day}-${selectedSlot.time}`;
        setBookedSlots((prev) => {
          const updated = new Set(prev);
          updated.delete(slotKey);
          return updated;
        });
      }
    }
  };

  // Check if a slot is booked
  const isSlotBooked = (date, time) => {
    return bookedSlots.has(`${date}-${time}`);
  };

  // Debug rendering
  console.log(
    "Rendering with selectedDate:",
    selectedDate,
    "Slots:",
    availableSlots[selectedDate]
  );

  return (
    <>
    <Scrolltop/>
      <Header />
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Doctor Info */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : doctor ? (
          <div className="flex items-center p-4 border border-gray-200 rounded-lg shadow bg-white">
            <img
              src={doctor.image}
              alt="Doctor"
              className="w-28 h-32 mr-4 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = Doctorimage; // Fallback to default image
              }}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{doctor.name}</h2>

              {/* Education */}
              {doctor.education && doctor.education.length > 0 && (
                <div className="mb-2">
                  <span className="text-gray-700 font-medium">
                    {doctor.education.map((edu) => edu.degree).join(", ")}
                  </span>
                </div>
              )}

              {/* Specialization */}
              {doctor.specialization && doctor.specialization.length > 0 && (
                <div className="mb-2">
                  <span className="text-gray-600 text-sm">
                    -{" "}
                    {doctor.specialization.map((spec) => spec.name).join(", ")}
                  </span>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center text-yellow-500 text-lg mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(doctor.rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-600 ml-2">({doctor.reviews})</span>
              </div>

              {/* Location */}
              <div className="text-gray-500 text-lg mb-2">
                📍 {doctor.location}
              </div>

              {/* Consultation Fee */}
              {doctor.consultationFee && (
                <div className="text-green-600 font-semibold">
                  AUD {doctor.consultationFee}
                </div>
              )}

              {/* Next Available */}
              {doctor.nextAvailable && (
                <div className="text-sm text-gray-500 mt-1">
                  {doctor.nextAvailable === "Not Available" ? (
                    <span className="text-red-500">⏰ Not Available</span>
                  ) : (
                    <span className="text-green-500">✓ Available</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Date Picker with Scroll */}
        <div className="border border-gray-200 rounded-lg shadow p-2 sm:p-4 bg-white w-full">
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              disabled={dateOffset === 0}
              className={`flex-shrink-0 p-2 sm:p-3 rounded-full transition-colors ${
                dateOffset === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Scrollable Date Container */}
            <div
              ref={dateScrollRef}
              className="flex-1 overflow-x-auto scrollbar-hide flex justify-center"
            >
              <div className="flex space-x-2 sm:space-x-4 pb-2 px-1 sm:px-2 justify-start items-center">
                {days.map((day, idx) => (
                  <button
                    key={`${dateOffset}-${idx}`}
                    onClick={() => handleDateSelect(day.fullDate)}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      selectedDate === day.fullDate
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                    }`}
                  >
                    {day.label}
                    <br />
                    {day.dateStr}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Available Slots */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="border border-gray-200 rounded-lg shadow p-6 bg-white cursor-pointer">
            <h3 className="text-xl font-semibold mb-4">
              Available Slots for{" "}
              {days.find((d) => d.fullDate === selectedDate)?.dateStr ||
                "Selected Date"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableSlots[selectedDate]?.length > 0 ? (
                availableSlots[selectedDate].map((slot, i) => {
                  const isBooked = slot.isBooked;
                  const isSelected =
                    selectedSlot?.day === selectedDate &&
                    selectedSlot?.time === slot.time;

                  return (
                    <button
                      key={i}
                      onClick={() =>
                        handleSlotSelect(selectedDate, slot.time, slot)
                      }
                      disabled={isBooked}
                      className={`w-full py-2 rounded-lg text-md font-medium border transition-colors relative ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-cyan-500 text-white border-blue-500 cursor-pointer"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 cursor-pointer"
                      }`}
                    >
                      {slot.time} - {slot.to && formatTime(slot.to)}
                      {isBooked && (
                        <span className="absolute top-1 right-1 text-xs text-red-500">
                          ✗
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No slots available for this date
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <div className="text-right">
          <button
            disabled={!selectedSlot}
            onClick={handleProceedToPay}
            className={`px-6 py-3 text-lg text-white rounded-lg font-semibold transition-colors ${
              selectedSlot
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default DoctorAppointment;
