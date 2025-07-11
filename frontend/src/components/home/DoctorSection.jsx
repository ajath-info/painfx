import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api'

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctor/get-all-active-doctors`);
        if (response.data?.status === 1 && Array.isArray(response.data.payload)) {
          const formattedDoctors = response.data.payload.map((doc) => ({
            name: `${doc.prefix} ${doc.f_name} ${doc.l_name}`,
            degree: doc.education?.map((e) => e.degree).join(', ') || 'N/A',
            specialty: doc.specialization?.map((s) => s.name).join(', ') || 'N/A',
            average_rating: doc.average_rating || 0,
            total_ratings: doc.total_ratings || 0,
            address: `${doc.city}, ${doc.state}, ${doc.country}`,
            rupee: `${doc.consultation_fee}`,
            availability: doc.next_available || 'Not Available',
            img:  doc.profile_image,
            // 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg',
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const nextSlide = () => {
    if (currentIndex + cardsPerPage < doctors.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleDoctors = doctors.slice(currentIndex, currentIndex + cardsPerPage);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const maxStars = 5;

    return (
      <div className="flex justify-center space-x-1 mb-1">
        {Array.from({ length: maxStars }, (_, i) => (
          <i
            key={i}
            className={`fa fa-star ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-start gap-8">
        
        {/* Left Side */}
        <div className="md:w-1/3 text-left">
          <h2 className="text-5xl font-bold mb-4 text-black">Book Our Doctor</h2>
          <p className="text-gray-600 mb-4 text-xl">Lorem Ipsum is simply dummy text</p>
          <p className="text-gray-600 mb-4 text-xl">
           It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
          </p>

          {/* Conditionally show extra content */}
    <p className="text-gray-600 mb-4 text-xl">web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes</p>

          <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-4 px-6 rounded mt-4">
                      Read More
                    </button>
        </div>

        {/* Right Side: Scrollable Doctor Cards */}
        <div className="md:w-2/3">
          {doctors.length > 0 ? (
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {doctors.map((doc, index) => (
                <div
                  key={index}
                  className="min-w-[300px] max-w-[300px] bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <div className="w-42 h-42 overflow-hidden mb-4">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">{doc.name}</h4>
                  <p className="text-gray-500">{doc.degree}</p>
                  <p className="text-gray-500 mb-2">{doc.specialty}</p>

                  {renderStars(doc.average_rating)}
                  <p className="text-sm text-gray-500 mb-2">({doc.total_ratings} reviews)</p>

                  <p className="text-gray-500 mb-2">
                    <i className="fa-solid fa-location-dot"></i> {doc.address}
                  </p>
                  <p className="text-gray-500 mb-2">
                    <i className="fa-solid fa-clock"></i> {doc.availability}
                  </p>
                  <p className="text-gray-500 mb-4">
                    <i className="fa-solid fa-indian-rupee-sign"></i> {doc.rupee}
                  </p>

                  <div className="flex justify-center gap-2 mt-auto">
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded">
                      View Profile
                    </button>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading doctors...</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-7 space-x-2">
            {Array.from({ length: Math.ceil(doctors.length - cardsPerPage + 1) }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${currentIndex === i ? 'bg-cyan-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;