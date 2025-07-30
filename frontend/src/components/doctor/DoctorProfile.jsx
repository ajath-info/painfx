import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import BASE_URL from '../../config';
import axios from "axios";

const token = localStorage.getItem("token");

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------- Tab State -------- */
  const [activeTab, setActiveTab] = useState("overview");

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
    const doctorId = state?.doctor?.doctor_id;
    if (!doctorId) {
      console.error("No doctorId found in state, redirecting to home");
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/doctor-profile?id=${doctorId}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

        if (response.data.status === 1 && response.data.payload) {
          const d = response.data.payload.doctor ?? {};
          // const specs = response.data.payload.specializations ?? [];
          const ratings = response.data.payload.ratings ?? [];
          const services = response.data.payload.services ?? [];
          const educations = response.data.payload.educations ?? [];
          const experiences = response.data.payload.experiences ?? [];
          const awards = response.data.payload.awards ?? [];
          const clinics = response.data.payload.clinics ?? [];

          const avgRating =
            ratings.length > 0
              ? Math.round(
                  ratings.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) /
                    ratings.length
                )
              : 0;

          const businessHours = {
            Monday: { start: "Closed", end: "Closed" },
            Tuesday: { start: "Closed", end: "Closed" },
            Wednesday: { start: "Closed", end: "Closed" },
            Thursday: { start: "Closed", end: "Closed" },
            Friday: { start: "Closed", end: "Closed" },
            Saturday: { start: "Closed", end: "Closed" },
            Sunday: { start: "Closed", end: "Closed" },
          };

          response.data.payload.availability.forEach((avail) => {
            const day = avail.day;
            const startTime = avail.start_time;
            const endTime = avail.end_time;
            if (!businessHours[day].start || startTime < businessHours[day].start) {
              businessHours[day].start = startTime;
            }
            if (!businessHours[day].end || endTime > businessHours[day].end) {
              businessHours[day].end = endTime;
            }
          });

          const formattedDoctor = {
            id: d.id ?? doctorId,
            name: d.full_name ?? "Unknown Doctor",
            // speciality: specs.map((s) => s.name).filter(Boolean).join(", ") || "..........",
            address: [d.address_line1, d.address_line2, d.city, d.state, d.country]
              .filter(Boolean)
              .join(", "),
            rating: avgRating,
            reviews: ratings.length || 0,
            location: [d.city, d.state, d.country].filter(Boolean).join(", "),
            image: d.profile_image || "https://via.placeholder.com/150",
            services: services.map((s) => s.name) || [],
            education: educations.map((edu) => ({
              institution: edu.institution,
              degree: edu.degree,
              years: `${edu.year_of_passing ?? ""}`,
            })) || [],
            experience: experiences.map((exp) => ({
              place: exp.hospital,
              years: `${exp.start_date ? new Date(exp.start_date).getFullYear() : "?"} - ${
                exp.currently_working ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : "?"
              }`,
            })) || [],
            awards: awards.map((award) => ({
              year: `${award.year ?? ""}`,
              title: award.title,
              description: award.description || "Lorem ipsum dolor sit amet...",
            })) || [],
            ratings,
            businessHours,
            bio: d.bio ?? "",
            clinics,
            consultationFee: d.consultation_fee || "Free Consultation",
          };

          setDoctorData(formattedDoctor);
          setLocalReviews(ratings);
        } else {
          throw new Error(response.data.message || "Invalid response data");
        }
      } catch (err) {
        setError(err.message);

        const fallback = {
          id: "1",
          name: "Dr. Darren Elder",
          speciality: "BDS, MDS - Oral & Maxillofacial Surgery",
          address: "Newyork, USA",
          rating: 4,
          reviews: 35,
          location: "Newyork, USA",
          image: "https://via.placeholder.com/150",
          services: ["Dental Fillings", "Teeth Whitening"],
          education: [
            { institution: "American Dental Medical University", degree: "BDS", years: "1998 - 2003" },
            { institution: "American Dental Medical University", degree: "MDS", years: "2003 - 2005" },
          ],
          experience: [
            { place: "Glowing Smiles Family Dental Clinic", years: "2010 - Present (5 years)" },
            { place: "Comfort Care Dental Clinic", years: "2007 - 2010 (3 years)" },
          ],
          awards: [{ year: "July 2019", title: "Humanitarian Award", description: "Lorem ipsum dolor sit amet..." }],
          ratings: [
            { author: "Richard Wilson", date: "2 Days ago", rating: 4, comment: "Great service!" },
            { author: "Charlene Reed", date: "3 Days ago", rating: 4, comment: "Very professional." },
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
          clinics: [],
          consultationFee: "Free Consultation",
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

  /* -------- Handle Review Submit -------- */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);

    const newReview = {
      author: reviewName.trim(),
      date: "Just now",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
    };

    setLocalReviews((r) => [newReview, ...r]);
    setDoctorData((d) =>
      d
        ? {
            ...d,
            reviews: (d.reviews || 0) + 1,
          }
        : d
    );

    setReviewName("");
    setReviewRating(5);
    setReviewComment("");

    // ✅ ADDED: submit rating API
    try {
      const payload = {
        doctor_id: doctor.id,
        rating: Number(reviewRating),
        title: "Patient Review",
        review: newReview.comment,
      };

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await axios.post(`${BASE_URL}/rating/rate-doctor`, payload, {
        headers,
      });

      if (res.data?.status !== 1) {
        console.warn("Review API failed:", res.data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }

    setSubmittingReview(false);
  };

  return (
    <>
      <Header />
      {/* Breadcrumb */}
<div className="breadcrumb-bar bg-cyan-500 p-4 shadow-md mb-6 text-white">
          <nav aria-label="breadcrumb" className="flex items-center space-x-2">
            <Link to="/" className="hover:text-blue-700 transition">Home</Link>
            <span className="text-white">/</span>
            <span className="font-medium">Doctor Profile</span>
          </nav>
          <h2 className="text-3xl font-bold mt-2">Doctor Profile</h2>
        </div>


      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
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
                <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">{doctor.name}</h4>
                <p className="text-gray-600 text-lg mt-1">{doctor.speciality}</p>
                <p className="text-gray-700 text-base mt-1">Not Available</p>
                <p><span className="text-gray-600 text-base mt-1">{doctor.address}</span></p>
                <div className="rating flex items-center text-yellow-500 mt-2">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className={i < doctor.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">({doctor.reviews} Reviews)</span>
                </div>
                <div className="clinic-services mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                  {(doctor.services || []).map((service, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{service}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end space-y-4">
                <ul className="flex flex-col items-center lg:items-end text-gray-700 text-sm space-y-1">
                  <li>AUD {doctor.consultationFee}</li>
                </ul>
                <Link
                  to={`/patient/booking?doctorId=${doctor.id}`}
                  className="mt-4 px-5 py-2 border border-cyan-400 text-cyan-400  rounded-lg hover:bg-cyan-500 hover:text-white transition duration-300"
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
                    className={`cursor-pointer nav-link py-3 px-6 font-semibold transition ${
                      activeTab === "overview" ? "text-cyan-500 border-b-2 border-cyan-500" : "text-gray-700 hover:text-cyan-500"
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab("reviews")}
                    className={`cursor-pointer nav-link py-3 px-6 font-semibold transition ${
                      activeTab === "reviews" ? "text-cyan-500 border-b-2 border-cyan-500" : "text-gray-700 hover:text-cyan-500"
                    }`}
                  >
                    Reviews
                  </button>
                </li>
              </ul>
            </nav>

            {/* Panels */}
            <div className="tab-content">
              {activeTab === "overview" && doctor && (
                <div id="doc_overview" className="tab-pane show active">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9">
                      <div className="about-widget">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">About Me</h4>
                        <p className="text-gray-600 leading-relaxed">{doctor.bio || "No bio available..."}</p>
                      </div>
                      <div className="education-widget mt-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Education</h4>
                        {doctor.education && doctor.education.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {doctor.education.map((edu, index) => (
                              <li key={index} className="text-gray-600">
                                {edu.degree} - {edu.institution} ({edu.years})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">No education details available.</p>
                        )}
                      </div>
                      <div className="experience-widget mt-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Experience</h4>
                        {doctor.experience && doctor.experience.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {doctor.experience.map((exp, index) => (
                              <li key={index} className="text-gray-600">
                                {exp.place} ({exp.years})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">No experience details available.</p>
                        )}
                      </div>
                      <div className="awards-widget mt-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Awards</h4>
                        {doctor.awards && doctor.awards.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {doctor.awards.map((award, index) => (
                              <li key={index} className="text-gray-600">
                                {award.title} ({award.year}) - {award.description}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">No awards details available.</p>
                        )}
                      </div>
                      <div className="clinics-widget mt-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Clinics</h4>
                        {doctor.clinics && doctor.clinics.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {doctor.clinics.map((clinic, index) => (
                              <li key={index} className="text-gray-600">
                                {clinic.name} - {clinic.address_line1}, {clinic.city}, {clinic.state}, {clinic.country} ({clinic.pin_code})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">No clinics available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && doctor && (
                <div id="doc_reviews" className="tab-pane show active">
                  <div className="widget review-listing">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h4>

                    {/* Reviews list */}
                    <div className="space-y-6">
                      {localReviews && localReviews.length > 0 ? (
                        localReviews.map((rating, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-start gap-4">
                              <img
                                src={rating.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=man&gender=male"}
                                alt={rating.name || "Anonymous User"}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-900 mb-1">{rating.name || "Anonymous"}</p>
                                    <p className="text-gray-500 text-sm ml-2">{rating.date || new Date(rating.created_at).toLocaleDateString()}</p>
                                  <div className="flex text-yellow-500">
                                    {Array(5).fill().map((_, i) => (
                                      <span key={i} className={i < Math.round(parseFloat(rating.rating)) ? "text-yellow-500" : "text-gray-300"}>★</span>
                                    ))}
                                  </div>
                                  </div>
                                  
                                </div>
                                <p className="text-gray-600 mt-2">{rating.review || rating.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No reviews available.</p>
                      )}
                    </div>

                    {/* "View All" placeholder */}
                    <div className="mt-6 text-center">
                      <button type="button" className="cursor-poiinter text-cyan-500 hover:underline font-medium">
                        View All Reviews ({doctor.reviews})
                      </button>
                    </div>

                    {/* Review Form */}
                    <div className="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-lg mx-auto">
                      <h5 className="text-xl font-semibold text-gray-900 mb-4">Add Your Feedback</h5>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
                          <label htmlFor="reviewRating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                          <select
                            id="reviewRating"
                            value={reviewRating}
                            onChange={(e) => setReviewRating(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
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
                            className="cursor-pointer px-5 py-2 border border-cyan-400 text-cyan-400  rounded-lg hover:bg-cyan-500 hover:text-white transition duration-300"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </form>
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
            className="cursor-pointer px-6 py-2 border border-cyan-400 text-cyan-400  rounded-lg hover:bg-cyan-500 hover:text-white transition duration-300"
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