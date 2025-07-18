import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const doctor =
    state?.doctor || {
      id: "1",
      name: "Dr. Darren Elder",
      speciality: "BDS, MDS - Oral & Maxillofacial Surgery",
      department: "Dentist",
      address:"Newyork, USA",
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
        {
          place: "Dream Smile Dental Practice",
          years: "2005 - 2007 (2 years)",
        },
      ],
      awards: [
        {
          year: "July 2019",
          title: "Humanitarian Award",
          description: "Lorem ipsum dolor sit amet...",
        },
        {
          year: "March 2011",
          title: "Certificate for International Volunteer Service",
          description: "Lorem ipsum dolor sit amet...",
        },
        {
          year: "May 2008",
          title: "The Dental Professional of The Year Award",
          description: "Lorem ipsum dolor sit amet...",
        },
      ],
    };

  const handleBack = () => navigate(-1);

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
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Doctor Profile</h2>
        </div>

        {/* Doctor Widget */}
        <div className="card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
  <div className="card-body p-6">
    <div className="doctor-widget flex flex-col lg:flex-row items-center lg:items-start gap-8">
      
      {/* LEFT SIDE - Doctor Image */}
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

      {/* MIDDLE - Doctor Details */}
      <div className="flex-1 text-center lg:text-left">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">{doctor.name}</h4>
        <p className="text-gray-600 text-lg mt-1">{doctor.speciality}</p>
        <p className="text-gray-700 text-base mt-1">{doctor.department}</p>
        <p> <span className="text-gray-600 text-base mt-1">{doctor.address}</span></p>
        <p> <div className="rating flex items-center text-yellow-500">
          {Array(5)
            .fill()
            .map((_, i) => (
              <span
                key={i}
                className={i < doctor.rating ? "text-yellow-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          <span className="ml-2 text-gray-600 text-sm">({doctor.reviews} Reviews)</span>
        </div>
        </p>
        {/* Services */}
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

      {/* RIGHT SIDE - Rating + Actions */}
      <div className="flex flex-col items-center lg:items-end space-y-4">
        {/* Rating */}
        

        {/* Info List */}
        <ul className="flex flex-col items-center lg:items-end text-gray-700 text-sm space-y-1">
          <li><i className="far fa-thumbs-up text-green-600 mr-1" /> 99% Approval</li>
          <li><i className="far fa-comment text-blue-600 mr-1" /> {doctor.reviews} Feedback</li>
          <li><i className="fas fa-map-marker-alt text-red-600 mr-1" /> {doctor.location}</li>
          <li><i className="far fa-money-bill-alt text-green-600 mr-1" /> $100/hr</li>
        </ul>

        {/* Book Appointment Button */}
        <a
          href={`/patient/booking?doctorId=${doctor.id}`}
          className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 transition"
        >
          Book Appointment
        </a>
      </div>
    </div>
  </div>
</div>


        {/* Doctor Details Tab */}
        <div className="card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-8">
          <div className="card-body p-6">
            <nav className="user-tabs mb-8">
              <ul className="nav nav-tabs flex space-x-8 border-b border-gray-200">
                <li className="nav-item">
                  <a
                    href="#doc_overview"
                    className="nav-link text-gray-700 py-3 px-6 font-semibold hover:text-blue-700 active:border-b-2 border-blue-700 transition"
                  >
                    Overview
                  </a>
                </li>
              </ul>
            </nav>

            <div className="tab-content">
              {/* Overview Content */}
              <div id="doc_overview" className="tab-pane fade show active">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-9">
                    <div className="about-widget">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">About Me</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua...
                      </p>
                    </div>

                    <div className="education-widget mt-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">Education</h4>
                      <div className="experience-box">
                        <ul className="experience-list space-y-6">
                          {(doctor.education || []).map((edu, index) => (
                            <li key={index} className="flex items-start">
                              <div className="experience-user">
                                <div className="w-2 h-2 bg-blue-700 rounded-full mt-2" />
                              </div>
                              <div className="experience-content ml-4">
                                <div className="timeline-content">
                                  <a
                                    href="#"
                                    className="text-blue-700 hover:underline font-medium"
                                  >
                                    {edu.institution}
                                  </a>
                                  <div className="text-gray-700">{edu.degree}</div>
                                  <span className="text-gray-500 text-sm">{edu.years}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="experience-widget mt-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        Work & Experience
                      </h4>
                      <div className="experience-box">
                        <ul className="experience-list space-y-6">
                          {(doctor.experience || []).map((exp, index) => (
                            <li key={index} className="flex items-start">
                              <div className="experience-user">
                                <div className="w-2 h-2 bg-blue-700 rounded-full mt-2" />
                              </div>
                              <div className="experience-content ml-4">
                                <div className="timeline-content">
                                  <a
                                    href="#"
                                    className="text-blue-700 hover:underline font-medium"
                                  >
                                    {exp.place}
                                  </a>
                                  <span className="text-gray-500 text-sm">{exp.years}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="awards-widget mt-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">Awards</h4>
                      <div className="experience-box">
                        <ul className="experience-list space-y-6">
                          {(doctor.awards || []).map((award, index) => (
                            <li key={index} className="flex items-start">
                              <div className="experience-user">
                                <div className="w-2 h-2 bg-blue-700 rounded-full mt-2" />
                              </div>
                              <div className="experience-content ml-4">
                                <div className="timeline-content">
                                  <p className="text-gray-500 text-sm">{award.year}</p>
                                  <h4 className="text-lg font-medium text-gray-900">
                                    {award.title}
                                  </h4>
                                  <p className="text-gray-600">{award.description}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="service-list mt-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">Services</h4>
                      <ul className="flex flex-wrap gap-3">
                        {[
                          "Tooth Cleaning",
                          "Root Canal Therapy",
                          "Implants",
                          "Composite Bonding",
                          "Fissure Sealants",
                          "Surgical Extractions",
                        ].map((service, index) => (
                          <li
                            key={index}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="service-list mt-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">Specializations</h4>
                      <ul className="flex flex-wrap gap-3">
                        {[
                          "Children Care",
                          "Dental Care",
                          "Oral and Maxillofacial Surgery",
                          "Orthodontist",
                          "Periodontist",
                          "Prosthodontics",
                        ].map((spec, index) => (
                          <li
                            key={index}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /#doc_overview */}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-right mt-8">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>
        </div>
      </div> {/* <-- CLOSE main wrapper div */}

      <Footer />
    </>
  );
};

export default DoctorProfile;