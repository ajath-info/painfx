import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const DoctorCard = ({ name, specialties, location, rating, reviews, feeRange, availableDate, image }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white mx-2 my-4">
      <img className="w-full h-48 object-cover" src={image} alt={`${name} profile`} />
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <h3 className="text-lg font-bold">{name}</h3>
        </div>
        <p className="text-gray-600 text-sm">{specialties}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">{'★'.repeat(rating)} {'☆'.repeat(5 - rating)}</span>
          <span className="text-gray-500 text-sm ml-1">({reviews})</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{location}</p>
        <p className="text-gray-500 text-sm mt-1">Available on {availableDate}</p>
        <p className="text-gray-500 text-sm mt-1">💰 {feeRange}</p>
        <div className="mt-4 flex justify-between">
          <a href="
          #" className="text-blue-500 hover:underline">View Profile</a>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Book Now</button>
        </div>
      </div>
    </div>
  );
};

const Favourites = () => {
  const doctors = [
    {
      name: "Ruby Perrin",
      specialties: "MDS - Periodontology and Oral Implantology, BDS (17)",
      location: "Florida, USA",
      rating: 4,
      reviews: 17,
      feeRange: "$100 - $1000",
      availableDate: "Fri, 22 Mar",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Darren Elder",
      specialties: "BDS, MDS - Oral & Maxillofacial Surgery",
      location: "Newyork, USA",
      rating: 4,
      reviews: 35,
      feeRange: "$50 - $300",
      availableDate: "Fri, 22 Mar",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Deborah Angel",
      specialties: "MBBS, MD - General Medicine, DNB - Cardiology",
      location: "Georgia, USA",
      rating: 4,
      reviews: 27,
      feeRange: "$100 - $400",
      availableDate: "Fri, 22 Mar",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <PatientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center flex-wrap">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} {...doctor} />
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default Favourites;