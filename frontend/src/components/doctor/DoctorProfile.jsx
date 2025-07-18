import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const BASE_URL = "http://localhost:5000/api";

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------- Tab State -------- */
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'reviews' | 'hours'

  /* -------- Local Reviews (so we can append new feedback) -------- */
  const [localReviews, setLocalReviews] = useState([]);

  /* -------- Review Form State -------- */
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  /* -------- Fetch Doctor Profile -------- */
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        // const token = localStorage.getItem("token");
        // if (!token) {
        //   navigate("/login");
        //   return;
        // }

        const doctorId = state?.doctorId || "1";

        const response = await fetch(
          `${BASE_URL}/user/doctor-profile?id=${encodeURIComponent(doctorId)}`,
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctor profile");
        }

        const data = await response.json();

        if (data.status === 1 && data.payload) {
          const d = data.payload.doctor ?? {};
          const specs = data.payload.specializations ?? [];
          const ratings = data.payload.ratings ?? [];
          const services = data.payload.services ?? [];
          const educations = data.payload.educations ?? [];
          const experiences = data.payload.experiences ?? [];
          const awards = data.payload.awards ?? [];

          const avgRating =
            ratings.length > 0
              ? Math.round(
                  ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    ratings.length
                )
              : 4;

          const formattedDoctor = {
            id: d.id ?? doctorId,
            name: d.full_name ?? "Unknown Doctor",
            speciality:
              specs.map((s) => s.name).filter(Boolean).join(", ") || "N/A",
            // department: specs[0]?.name || "N/A",
            address: [d.address_line1, d.city, d.state, d.country]
              .filter(Boolean)
              .join(", "),
            rating: avgRating,
            reviews: ratings.length || 35,
            location: [d.city, d.state, d.country].filter(Boolean).join(", "),
            image: d.profile_image || "https://via.placeholder.com/150",
            services: services.map((s) => s.name) || [],
            education:
              educations.map((edu) => ({
                institution: edu.institution,
                degree: edu.degree,
                years: `${edu.year_of_passing ?? ""}`,
              })) || [],
            experience:
              experiences.map((exp) => ({
                place: exp.hospital,
                years: `${exp.start_date ? new Date(exp.start_date).getFullYear() : "?"} - ${
                  exp.currently_working
                    ? "Present"
                    : exp.end_date
                    ? new Date(exp.end_date).getFullYear()
                    : "?"
                }`,
              })) || [],
            awards:
              awards.map((award) => ({
                year: `${award.year ?? ""}`,
                title: award.title,
                description: "Lorem ipsum dolor sit amet...",
              })) || [],
            ratings,
            businessHours:
              data.payload.businessHours || {
                Monday: { start: "07:00 AM", end: "09:00 PM" },
                Tuesday: { start: "07:00 AM", end: "09:00 PM" },
                Wednesday: { start: "07:00 AM", end: "09:00 PM" },
                Thursday: { start: "07:00 AM", end: "09:00 PM" },
                Friday: { start: "07:00 AM", end: "09:00 PM" },
                Saturday: { start: "07:00 AM", end: "09:00 PM" },
                Sunday: { start: "Closed", end: "Closed" },
              },
            bio: d.bio ?? "",
          };

          setDoctorData(formattedDoctor);
          setLocalReviews(ratings); // seed review list
        } else {
          throw new Error(data.message || "Invalid response data");
        }
      } catch (err) {
        setError(err.message);

        // Fallback demo data
        const fallback = {
          id: "1",
          name: "Dr. Darren Elder",
          speciality: "BDS, MDS - Oral & Maxillofacial Surgery",
          department: "Dentist",
          address: "Newyork, USA",
          rating: 4,
          reviews: 35,
          location: "Newyork, USA",
          image: "https://via.placeholder.com/150",
          services: ["Dental Fillings", "Teeth Whitening"],
          education: [
            {
              institution: "American Dental Medical University",
              degree: "BDS",
              years: "1998 - 2003",
            },
            {
              institution: "American Dental Medical University",
              degree: "MDS",
              years: "2003 - 2005",
            },
          ],
          experience: [
            {
              place: "Glowing Smiles Family Dental Clinic",
              years: "2010 - Present (5 years)",
            },
            {
              place: "Comfort Care Dental Clinic",
              years: "2007 - 2010 (3 years)",
            },
          ],
          awards: [
            {
              year: "July 2019",
              title: "Humanitarian Award",
              description: "Lorem ipsum dolor sit amet...",
            },
          ],
          ratings: [
            {
              author: "Richard Wilson",
              date: "2 Days ago",
              rating: 4,
              comment: "Great service!",
            },
            {
              author: "Charlene Reed",
              date: "3 Days ago",
              rating: 4,
              comment: "Very professional.",
            },
          ],
          businessHours: {
            Monday: { start: "07:00 AM", end: "09:00 PM" },
            Tuesday: { start: "07:00 AM", end: "09:00 PM" },
            Wednesday: { start: "07:00 AM", end: "09:00 PM" },
            Thursday: { start: "07:00 AM", end: "09:00 PM" },
            Friday: { start: "07:00 AM", end: "09:00 PM" },
            Saturday: { start: "07:00 AM", end: "09:00 PM" },
            Sunday: { start: "Closed", end: "Closed" },
          },
          bio: "",
        };

        setDoctorData(fallback);
        setLocalReviews(fallback.ratings);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [state, navigate]);

  /* -------- Back -------- */
  const handleBack = () => navigate(-1);

  /* -------- Loading -------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error) console.error("Error:", error);

  const doctor = doctorData;

  /* -------- Quick “Open Now” rough calc (kept from your code) -------- */
  const currentDate = new Date();
  const isOpen =
    currentDate.getDay() === 5 &&
    currentDate.getHours() + 6 >= 7 &&
    currentDate.getHours() + 6 < 21;

  const todayIST = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  });

  /* -------- Handle Review Submit -------- */
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);

    // Build a new review object (client‑side only for now)
    const newReview = {
      author: reviewName.trim(),
      date: "Just now",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
    };

    setLocalReviews((r) => [newReview, ...r]);
    // update displayed review count
    setDoctorData((d) =>
      d
        ? {
            ...d,
            reviews: (d.reviews || 0) + 1,
          }
        : d
    );

    // reset form
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    setSubmittingReview(false);

    // TODO: call your API to persist review
    // await fetch(...POST review...)
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="breadcrumb-bar bg-white p-4 rounded-lg shadow-md mb-6">
          <nav
            aria-label="breadcrumb"
            className="flex items-center space-x-2 text-gray-600"
          >
            <Link to="/" className="hover:text-blue-700 transition">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-blue-700 font-medium">Doctor Profile</span>
          </nav>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Doctor Profile
          </h2>
        </div>

        {/* Doctor Widget */}
        <div className="card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="card-body p-6">
            <div className="doctor-widget flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="doc-info-left flex-shrink-0">
                <div className="doctor-img relative">
                  <img
                    src={doctor.image}
                    alt="Doctor"
                    className="w-40 h-40 lg:w-56 lg:h-56 object-cover rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-transparent rounded-xl opacity-50 blur-sm" />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {doctor.name}
                </h4>
                <p className="text-gray-600 text-lg mt-1">{doctor.speciality}</p>
                <p className="text-gray-700 text-base mt-1">
                  {doctor.department}
                </p>
                <p>
                  <span className="text-gray-600 text-base mt-1">
                    {doctor.address}
                  </span>
                </p>
                <div className="rating flex items-center text-yellow-500 mt-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < doctor.rating ? "text-yellow-500" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    ({doctor.reviews} Reviews)
                  </span>
                </div>
                <div className="clinic-services mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                  {(doctor.services || []).map((service, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end space-y-4">
                <ul className="flex flex-col items-center lg:items-end text-gray-700 text-sm space-y-1">
                  {/* <li>
                    <i className="far fa-thumbs-up text-green-600 mr-1" /> 99%
                    Approval
                  </li> */}
                  {/* <li>
                    <i className="far fa-comment text-blue-600 mr-1" />{" "}
                    {doctor.reviews} Feedback
                  </li> */}
                  {/* <li>
                    <i className="fas fa-map-marker-alt text-red-600 mr-1" />{" "}
                    {doctor.location}
                  </li> */}
                  <li>
                    <i className="far fa-money-bill-alt text-green-600 mr-1" /> $
                    100/hr
                  </li>
                </ul>
                <Link
                  to={`/patient/booking?doctorId=${doctor.id}`}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 transition"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Details Tabs */}
        <div className="card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-8">
          <div className="card-body p-6">
            {/* Tab Nav */}
            <nav className="user-tabs mb-8">
              <ul className="nav nav-tabs flex space-x-8 border-b border-gray-200">
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`nav-link py-3 px-6 font-semibold transition ${
                      activeTab === "overview"
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-700 hover:text-blue-700"
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab("reviews")}
                    className={`nav-link py-3 px-6 font-semibold transition ${
                      activeTab === "reviews"
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-700 hover:text-blue-700"
                    }`}
                  >
                    Reviews
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab("hours")}
                    className={`nav-link py-3 px-6 font-semibold transition ${
                      activeTab === "hours"
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-700 hover:text-blue-700"
                    }`}
                  >
                    Business Hours
                  </button>
                </li>
              </ul>
            </nav>

            {/* Panels */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div id="doc_overview" className="tab-pane show active">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9">
                      <div className="about-widget">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">
                          About Me
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {doctorData?.bio ||
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."}
                        </p>
                      </div>
                      {/* Add other overview sections here if desired */}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div id="doc_reviews" className="tab-pane show active">
                  <div className="widget review-listing">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      Patient Reviews
                    </h4>

                    {/* Reviews list */}
                    <div className="space-y-6">
                      {localReviews.map((rating, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src="https://via.placeholder.com/50"
                              alt="User"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {rating.author}
                                  </span>
                                  <span className="text-gray-500 text-sm ml-2">
                                    {rating.date}
                                  </span>
                                </div>
                                <div className="flex text-yellow-500">
                                  {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                      <span
                                        key={i}
                                        className={
                                          i < rating.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }
                                      >
                                        ★
                                      </span>
                                    ))}
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2">
                                {rating.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* "View All" placeholder */}
                    <div className="mt-6 text-center">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View All Reviews ({doctor.reviews})
                      </button>
                    </div>

                    {/* Review Form */}
                    <div className="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-lg mx-auto">
                      <h5 className="text-xl font-semibold text-gray-900 mb-4">
                        Add Your Feedback
                      </h5>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label
                            htmlFor="reviewName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Name
                          </label>
                          <input
                            id="reviewName"
                            type="text"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="reviewRating"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Rating
                          </label>
                          <select
                            id="reviewRating"
                            value={reviewRating}
                            onChange={(e) => setReviewRating(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {n} Star{n > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="reviewComment"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Comment
                          </label>
                          <textarea
                            id="reviewComment"
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            required
                          />
                        </div>

                        <div className="text-right">
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hours" && (
                <div id="doc_business_hours" className="tab-pane show active">
                  <div className="widget business-widget">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      Business Hours
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                      {Object.entries(doctor.businessHours).map(
                        ([day, hours]) => {
                          const isToday = day === todayIST;
                          const isClosed = hours.start === "Closed";
                          const showOpenNow = isToday && isOpen && !isClosed;
                          return (
                            <div
                              key={day}
                              className={`flex justify-between items-center py-2 ${
                                showOpenNow ? "bg-green-50" : ""
                              }`}
                            >
                              <span
                                className={`font-medium ${
                                  isToday ? "text-blue-700" : "text-gray-800"
                                }`}
                              >
                                {day}{" "}
                                {isToday && (
                                  <span className="text-sm text-gray-500">
                                    (Today)
                                  </span>
                                )}
                              </span>
                              <span
                                className={`text-gray-600 ${
                                  isClosed ? "text-red-600 font-semibold" : ""
                                }`}
                              >
                                {isClosed
                                  ? "Closed"
                                  : `${hours.start} - ${hours.end}`}
                                {showOpenNow && (
                                  <span className="ml-2 text-green-600 font-semibold">
                                    Open Now
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="text-right mt-8">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DoctorProfile;