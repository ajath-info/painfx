import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import
import PatientLayout from '../../layouts/PatientLayout';
import BASE_URL from '../../config';



const DoctorCard = ({
  name,
  // specialties,
  location,
  rating,
  reviews,
  feeRange,
  availableDate,
  image,
  rawDoctorData, // ✅ New prop for full doctor object
}) => {
  const navigate = useNavigate(); // ✅ Hook inside the component

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={image} alt={`${name} profile`} />
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <h3 className="text-lg font-bold">{name}</h3>
        </div>
        {/* <p className="text-gray-600 text-sm">{specialties}</p> */}
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
          <span className="text-gray-500 text-sm ml-1">({reviews})</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{location}</p>
        <p className="text-gray-500 text-sm mt-1">Available on {availableDate}</p>
        <p className="text-gray-500 text-sm mt-1">{feeRange}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => navigate('/doctor/profile', { state: { doctor: rawDoctorData } })}
            className="px-4 py-2 rounded hover:bg-blue-600 hover:text-white border border-blue-600 text-blue-600"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate('/patient/booking', { state: { doctor: rawDoctorData } })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Favourites = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchFavouriteDoctors();
  }, []);

  const fetchFavouriteDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/patient/favorite-doctors?page=1&limit=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data?.payload?.data || [];

      const mapped = data.map((doc) => ({
        name: `${doc.prefix || ''} ${doc.f_name || ''} ${doc.l_name || ''}`.trim(),
        // specialties: doc.specialization?.map((s) => s.name).join(', ') || 'N/A',
        location: [doc.address_line1, doc.address_line2, doc.city, doc.state, doc.country].filter(Boolean).join(', ') || 'Unknown',
        rating: doc.average_rating || 0,
        reviews: doc.total_ratings || 0,
        feeRange: doc.consultation_fee_type === 'paid' ? `$${doc.consultation_fee || 0}` : 'Free',
        availableDate: doc.next_available || 'Not Available',
        image: doc.profile_image || 'https://via.placeholder.com/100x100?text=No+Image',
        rawDoctorData: doc, // ✅ Store raw object for navigation state
      }));

      setDoctors(mapped);
    } catch (err) {
      console.error('Failed to fetch favorite doctors:', err);
    }
  };

  return (
    <PatientLayout>
      <div className="container mx-auto px-[10px] py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} {...doctor} />
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default Favourites;
