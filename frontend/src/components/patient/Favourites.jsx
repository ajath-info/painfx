import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const DoctorCard = ({ name, specialties, location, rating, reviews, feeRange, availableDate, image }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={image} alt={`${name} profile`} />
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <h3 className="text-lg font-bold">{name}</h3>
        </div>
        <p className="text-gray-600 text-sm">{specialties}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
          <span className="text-gray-500 text-sm ml-1">({reviews})</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{location}</p>
        <p className="text-gray-500 text-sm mt-1">Available on {availableDate}</p>
        <p className="text-gray-500 text-sm mt-1">💰 {feeRange}</p>
        <div className="mt-4 flex justify-between">
          <a href="#" className="px-4 py-2 rounded hover:bg-blue-600 hover:text-white border border-blue-600 text-blue-600">
            View Profile
          </a>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Book Now
          </button>
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzl521Bp0NClCK6LcfOcskWQuagrUnnNC31x2PQGSVLcDI8JoKHFxr12vkT3dRvqA0JyM&usqp=CAU",
    },
    {
      name: "Darren Elder",
      specialties: "BDS, MDS - Oral And Maxillofacial Surgery or Maxillofacial Surgery",
      location: "Newyork, USA",
      rating: 4,
      reviews: 35,
      feeRange: "$50 - $300",
      availableDate: "Fri, 22 Mar",
      image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    },
    {
      name: "Deborah Angel",
      specialties: "MBBS, MD - General Medicine, DNB - Cardiology",
      location: "Georgia, USA",
      rating: 4,
      reviews: 27,
      feeRange: "$100 - $400",
      availableDate: "Fri, 22 Mar",
      image: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*",
    },
  ];

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