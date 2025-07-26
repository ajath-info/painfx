import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  IndianRupee,
  ThumbsUp,
  MessageCircle,
  Info,
  Calendar,
  User,
  AlertCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import BASE_URL from "../../config";

// Placeholder for Header and Footer (replace with actual imports)
import Header from "../common/Header";
import Footer from "../common/Footer";

const DoctorSearchPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract location and keyword from query parameters
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("location") || "";
  const keyword = queryParams.get("keyword") || "";

  useEffect(() => {
    fetchAllDoctors();
  }, [city, keyword]);

  useEffect(() => {
    applyFilters();
  }, [selectedGender, selectedSpecialists, sortBy, allDoctors, keyword]);

  const fetchAllDoctors = async () => {
    setIsLoading(true);
    setError("");
    try {
      let apiUrl;
      let queryString = "";

      if (city && city.trim() !== "") {
        queryString = new URLSearchParams({ city }).toString();
        apiUrl = `${BASE_URL}/clinics?${queryString}`;
      } else {
        apiUrl = `${BASE_URL}/doctors/all`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);

      if (data.error) {
        throw new Error(data.message || "Failed to fetch doctors");
      }

      const transformedDoctors = (data.payload.fetchedDoctor || []).map(
        (doctor) => ({
          id: doctor.id,
          name:
            doctor.f_name && doctor.l_name
              ? `${doctor.f_name} ${doctor.l_name}`
              : doctor.full_name || "Unknown Doctor",
          speciality: doctor.speciality || "Physiotherapy",
          // department: doctor.department || "General",
          rating: doctor.rating || 4,
          reviews: doctor.reviews || 0,
          approval: doctor.approval || "95%",
          feedback: doctor.feedback || "0 Feedback",
          priceRange: doctor.price_range,
          consultationFee: doctor.consultation_fee
            ? Number(doctor.consultation_fee)
            : null,
          consultationFeeType: doctor.consultation_fee_type || "paid",
          // services: doctor.services
          //   ? JSON.parse(doctor.services)
          //   : ["Consultation"],
          image: doctor.profile_image || null,
          gender: doctor.gender ? doctor.gender.toLowerCase() : "male",
          isApproved: doctor.is_approved || false,
          bio: doctor.bio || null,
          doctorCity: doctor.city || null,
          doctorState: doctor.state || null,
          address_line1: doctor.address_line1 || "",
          phone: `${doctor.phone_code || ""}${doctor.phone || ""}`,
          createdAt: doctor.created_at || new Date().toISOString(),
        })
      );

      setAllDoctors(transformedDoctors);
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(error.message || "Failed to load data");
      setAllDoctors([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allDoctors];

    if (selectedGender.length > 0) {
      filtered = filtered.filter((doctor) => {
        const doctorGender = doctor.gender
          ? doctor.gender.toLowerCase()
          : "male";
        return selectedGender.includes(doctorGender);
      });
    }

    if (selectedSpecialists.length > 0) {
      filtered = filtered.filter((doctor) =>
        selectedSpecialists.some(
          (spec) =>
            doctor.department?.toLowerCase().includes(spec.toLowerCase()) ||
            doctor.speciality?.toLowerCase().includes(spec.toLowerCase())
        )
      );
    }

    if (keyword && keyword.trim() !== "") {
      const searchTerm = keyword.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(searchTerm) ||
          doctor.speciality?.toLowerCase().includes(searchTerm) ||
          doctor.department?.toLowerCase().includes(searchTerm)
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "rating")
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (sortBy === "popular")
          return (Number(b.reviews) || 0) - (Number(a.reviews) || 0);
        if (sortBy === "latest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "free") {
          const aFree =
            a.consultationFeeType === "free"
              ? 0
              : Number(a.consultationFee) || 999999;
          const bFree =
            b.consultationFeeType === "free"
              ? 0
              : Number(b.consultationFee) || 999999;
          return aFree - bFree;
        }
        return 0;
      });
    } else if (!city || city.trim() === "") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setDoctors(filtered);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  const handleSpecialistChange = (specialist) => {
    setSelectedSpecialists((prev) =>
      prev.includes(specialist)
        ? prev.filter((s) => s !== specialist)
        : [...prev, specialist]
    );
  };

  const clearAllFilters = () => {
    setSelectedGender([]);
    setSelectedSpecialists([]);
    setSelectedDate("");
    setSortBy("");
  };

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const availableSpecialists = [
    ...new Set(
      allDoctors
        .map((doctor) => doctor.department?.toLowerCase())
        .filter(Boolean)
    ),
  ];

  const handleViewProfile = (doctorId) => {
    navigate("/doctor/profile", { state: { doctor: { doctor_id: doctorId } } });
  };

  const handleBookAppointment = (doctorId) => {
    navigate("/patient/booking", {
      state: { doctor: { doctor_id: doctorId } },
    });
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Breadcrumb Section */}
      <div className="bg-cyan-400 text-white">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center text-xs mt-2">
            <span>Home</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Search</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Search Filter</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg sm:text-xl font-bold">
              {doctors.length} matches found for : {keyword || "Doctors"} In{" "}
              {city || "All Cities"}
            </h1>
            <button
              onClick={toggleFilter}
              className="lg:hidden flex items-center px-3 py-1 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilter ? "Hide Filter" : "Show Filter"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading doctors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchAllDoctors}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Filter Sidebar */}
            <div
              className={`w-full lg:w-2/6 bg-white p-4 ${
                showFilter ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Search Filter</h3>
                  <button
                    onClick={clearAllFilters}
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      placeholder="Select Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Gender</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGender.includes("male")}
                        onChange={() => handleGenderChange("male")}
                        className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 mr-3"
                      />
                      <span className="text-sm">Male Doctor</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGender.includes("female")}
                        onChange={() => handleGenderChange("female")}
                        className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 mr-3"
                      />
                      <span className="text-sm">Female Doctor</span>
                    </label>
                  </div>
                  {selectedGender.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Selected: {selectedGender.join(", ")}
                    </div>
                  )}
                </div>

                {/* Specialist Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Select Specialist</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableSpecialists.length > 0 ? (
                      availableSpecialists.map((specialist) => (
                        <label key={specialist} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSpecialists.includes(specialist)}
                            onChange={() => handleSpecialistChange(specialist)}
                            className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 mr-3"
                          />
                          <span className="text-sm capitalize">
                            {specialist}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No specialists available
                      </p>
                    )}
                  </div>
                  {selectedSpecialists.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Selected: {selectedSpecialists.length} specialist(s)
                    </div>
                  )}
                </div>

                <button className="w-full bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="w-full lg:w-4/6 p-4 bg-white h-screen overflow-y-auto">
              {doctors.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">
                    {allDoctors.length === 0
                      ? `No doctors found${city ? ` in ${city}` : ""}`
                      : "No doctors match your current filters"}
                  </p>
                  <p className="text-sm">
                    {allDoctors.length === 0
                      ? "Try searching in a different city."
                      : "Try adjusting your filters to see more results."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Doctor Image */}
                        <div className="flex-shrink-0 w-32 h-32 mx-auto sm:mx-0">
                          {doctor.image ? (
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-32 h-32 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center ${
                              doctor.image ? "hidden" : ""
                            }`}
                          >
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 text-center sm:text-left">
                              {doctor.name}
                            </h3>
                            <p className="text-gray-600 mb-2 text-center sm:text-left">
                              {doctor.speciality}
                            </p>

                            <div className="flex items-center justify-center sm:justify-start mb-2">
                              {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-100 text-cyan-800 mr-2">
                                <User className="w-3 h-3 mr-1" />
                                {doctor.department}
                              </span> */}
                            </div>

                            <div className="flex items-center justify-center sm:justify-start mb-2">
                              <div className="flex items-center mr-4">
                                {renderStars(doctor.rating)}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({doctor.reviews})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>
                                {doctor.doctorCity}, {doctor.doctorState}
                              </span>
                            </div>

                            {/* Service Tags */}
                            {doctor.services && doctor.services.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                                {doctor.services.map((service, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded ${
                                      index % 2 === 0
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right Side Info */}
                          <div className="flex flex-col items-center sm:items-start sm:w-40">
                            <div className="mb-4 space-y-2 text-center sm:text-left">
                              {/* <div className="flex items-center text-sm justify-center sm:justify-start">
                                <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                                <span>{doctor.approval}</span>
                              </div> */}
                              {/* <div className="flex items-center text-sm justify-center sm:justify-start">
                                <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                                <span>{doctor.feedback}</span>
                              </div> */}
                              {/* <div className="flex items-center text-sm justify-center sm:justify-start"> */}
  {/* <MapPin className="w-4 h-4 mr-2 text-gray-500" /> */}
  {/* <span>
    {doctor.doctorCity ? doctor.doctorCity : "......"}, {doctor.doctorState ? doctor.doctorState : "......"}
  </span> */}
{/* </div> */}

                              <div className="flex items-center text-sm font-semibold justify-center sm:justify-start">
                                <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                                <span>
                                  {doctor.consultationFeeType === "free"
                                    ? "Free Consultation"
                                    : `${
                                        doctor.consultationFee ||
                                        doctor.priceRange
                                      }`}
                                </span>
                                <Info className="w-4 h-4 ml-1 text-gray-400" />
                              </div>
                            </div>

                            <div className="flex flex-col items-center sm:items-start space-y-2 w-full sm:w-40">
                              <button
                                onClick={() => handleViewProfile(doctor.id)}
                                className="cursor-pointer w-full px-6 py-2 border border-cyan-400 text-cyan-400 rounded-md hover:bg-cyan-500 hover:text-white transition-colors text-sm"
                              >
                                VIEW PROFILE
                              </button>
                              {/* <button
                                onClick={() => handleBookAppointment(doctor.id)}
                                className="cursor-pointer w-full px-6 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors text-sm"
                              >
                                BOOK APPOINTMENT
                              </button> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DoctorSearchPage;