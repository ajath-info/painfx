import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react'; // Added Heart icon
import { toast, ToastContainer } from 'react-toastify'; // Added react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Added toastify CSS
import PatientLayout from '../../layouts/PatientLayout';
import BASE_URL from '../../config';

const DoctorCard = ({
  name,
  location,
  rating,
  reviews,
  feeRange,
  availableDate,
  image,
  rawDoctorData,
  onRemoveFavorite, // New prop for removing favorite
  isRemoving, // New prop for loading state
}) => {
  const navigate = useNavigate();

  console.log("rawDoctorData", rawDoctorData);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white relative">
      <button
        onClick={() => onRemoveFavorite(rawDoctorData.doctor_id)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        title="Remove from favorites"
        disabled={isRemoving}
      >
        {isRemoving ? (
          <div className="animate-spin w-6 h-6 border-2 border-red-500 rounded-full"></div>
        ) : (
          <Heart className="w-6 h-6 fill-red-500 text-red-500" /> // Always red since in favorites
        )}
      </button>
      <img className="w-full h-[40vh] object-cover" src={image} alt={`${name} profile`} />
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <h3 className="text-lg font-bold">{name}</h3>
        </div>
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
            className="cursor-pointer px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition duration-300"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate('/patient/booking', { state: { doctor: { id: rawDoctorData.doctor_id } } })}
            className="cursor-pointer px-4 py-2 bg-cyan-500 border border-cyan-400 text-white rounded-lg hover:bg-cyan-600 transition duration-300"
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
  const [isRemovingFavorite, setIsRemovingFavorite] = useState(null); // Track removing doctor ID
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavouriteDoctors();
  }, []);

  const fetchFavouriteDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to view favorites.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/login");
        return;
      }

      const response = await axios.get(`${BASE_URL}/patient/favorite-doctors?page=1&limit=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data?.payload?.data || [];

      const mapped = data.map((doc) => ({
        name: `${doc.prefix || ''} ${doc.f_name || ''} ${doc.l_name || ''}`.trim(),
        specialties: doc.specialization?.map((s) => s.name).join(', ') || 'Unknown',
        location: [doc.address_line1, doc.address_line2, doc.city, doc.state, doc.country].filter(Boolean).join(', ') || 'Unknown',
        rating: doc.average_rating || 0,
        reviews: doc.total_ratings || 0,
        feeRange: doc.consultation_fee_type === 'paid' ? `$${doc.consultation_fee || 0}` : 'Free',
        availableDate: doc.next_available || 'Not Available',
        image: doc.profile_image || 'https://via.placeholder.com/100x100?text=No+Image',
        rawDoctorData: doc,
      }));

      setDoctors(mapped);
    } catch (err) {
      console.error('Failed to fetch favorite doctors:', err);
      toast.error("Failed to load favorite doctors.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const removeFavorite = async (doctorId) => {
    try {
      setIsRemovingFavorite(doctorId); // Set loading state
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to manage favorites.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/patient/toggle-favorite-doctor`,
        { doctor_id: doctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.error) {
        throw new Error(response.data.message || "Failed to remove favorite");
      }

      // Remove doctor from UI
      setDoctors((prev) => prev.filter((doc) => doc.rawDoctorData.doctor_id !== doctorId));

      toast.success(response.data.message || "Doctor removed from favorites", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Failed to remove favorite doctor:', err);
      toast.error(err.message || "Failed to remove favorite", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsRemovingFavorite(null); // Clear loading state
    }
  };

  return (
    <PatientLayout>
      <ToastContainer />
      <div className="container mx-auto px-[10px] py-8">
        <h2 className="text-2xl font-bold mb-6">Favorite Doctors</h2>
        {doctors.length === 0 ? (
          <p className="text-gray-500 text-center">No favorite doctors found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={index}
                {...doctor}
                onRemoveFavorite={removeFavorite}
                isRemoving={isRemovingFavorite === doctor.rawDoctorData.doctor_id}
              />
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default Favourites;