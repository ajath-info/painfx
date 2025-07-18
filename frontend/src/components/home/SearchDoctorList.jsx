import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const keyword = searchParams.get('keyword');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctor/get-all-active-doctors`, {
          params: { location }
        });
        if (res.data.status === 1) {
          setDoctors(res.data.payload);
        }
      } catch (err) {
        console.error('Error fetching doctors', err);
      }
    };

    if (location) {
      fetchDoctors();
    }
  }, [location]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{keyword}" in {location}</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul className="space-y-4">
          {doctors.map(doc => (
            <li key={doc.doctor_id} className="border p-4 rounded-md shadow-sm">
              <div className="flex items-start space-x-4">
                <img src={doc.profile_image} alt={doc.f_name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{doc.prefix} {doc.f_name} {doc.l_name}</h3>
                  <p className="text-sm text-gray-600">{doc.specialization?.map(s => s.name).join(', ')}</p>
                  <p className="text-sm text-gray-500">{doc.bio}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
