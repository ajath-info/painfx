import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";


const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/doctor/get-all-active-doctors`
        );
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        if (data?.status === 1 && Array.isArray(data.payload)) {
          const formattedDoctors = data.payload.map((doc) => ({
            display: {
              id: doc.doctor_id, // Use doctor_id instead of id
              name: `${doc.prefix} ${doc.f_name} ${doc.l_name}`,
              degree:
                doc.education?.map((e) => e.degree).join(", ") || "..........",
              specialty:
                doc.specialization?.map((s) => s.name).join(", ") ||
                "..........",
              average_rating: doc.average_rating || 0,
              total_ratings: doc.total_ratings || 0,
              address: `${doc.city}, ${doc.state}, ${doc.country}`,
              rupee: `${doc.consultation_fee}`,
              availability: doc.next_available
                ? formatDate(doc.next_available)
                : "Not Available",
              img: doc.profile_image || null,
              verified: true,
            },
            full: doc,
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const renderStars = (rating, totalRatings) => {
    const fullStars = Math.floor(rating);
    const maxStars = 5;
    return (
      <div className="flex items-center justify-center space-x-1 mb-2">
        <div className="flex space-x-1">
          {Array.from({ length: maxStars }, (_, i) => (
            <i
              key={i}
              className={`fa fa-star text-sm ${
                i < fullStars ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-2">({totalRatings})</span>
      </div>
    );
  };

  const formatPrice = (price) => {
    if (!price || price === "..........") return "Price on request";
    return `${price} `;
  };

  const bookAppointment = async (doctor) => {
    try {
      const patientBearerToken = localStorage.getItem("token");
      if (!patientBearerToken) {
        navigate("/login");
        return;
      }

      navigate("/patient/booking", {
        state: { doctor },
      });
    } catch (error) {
      console.error("Error initiating booking:", error);
      alert("An error occurred while initiating the booking.");
    }
  };

  const viewProfile = (doctor) => {
    console.log("Full Doctor Object:", doctor); // Debug log
    console.log("Doctor ID being passed:", doctor.doctor_id); // Use doctor_id instead of id
    navigate("/doctor/profile", {
      state: { doctor }, // Use doctor_id instead of id
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12">
          {/* Left Content */}
          <div className="w-full sm:w-4/5 lg:w-3/5 mb-10 lg:mb-0 lg:pr-10 px-4 sm:px-6">
            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-10 leading-tight">
              Book Our Doctor
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-5 leading-relaxed">
              Get Personalized Physiotherapy Care from Expert Professionals
            </p>
            <p className="text-base sm:text-xl text-gray-600 mb-5 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              Whether you're recovering from an injury, managing chronic pain,
              or seeking preventive therapy — our licensed physiotherapists are
              here to help. Book your appointment in just a few clicks.
            </p>
            <p className="text-base sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              Review your booking summary and make payment securely (online/cash
              on visit). Receive instant confirmation.
            </p>
          </div>

          {/* Right Content - Doctors Cards */}
          <div className="lg:w-3/5 flex-1">
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {doctors.length > 0 ? (
                doctors.map((docObj, index) => {
                  const doc = docObj.display;
                  const fullDoc = docObj.full;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex-none w-80"
                    >
                      <div className="relative h-75 overflow-hidden">
                        <img
                          src={doc.img}
                          alt={doc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {doc.verified && (
                          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
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
                          <button
                            className="cursor-pointer flex-1 bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                            onClick={() => viewProfile(fullDoc)}
                          >
                            View Profile
                          </button>
                          <button
                            className="cursor-pointer flex-1 bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                            onClick={() => bookAppointment(fullDoc)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
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
