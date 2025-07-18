// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SearchPage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate(); // ✅ Moved inside the component
//   const location = searchParams.get('location');
//   const keyword = searchParams.get('keyword');
//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await axios.get(`https://painfx-2.onrender.com/api/doctor/get-all-active-doctors`, {
//           params: { location },
//         });
//         if (res.data.status === 1) {
//           setDoctors(res.data.payload);
//         }
//       } catch (err) {
//         console.error('Error fetching doctors', err);
//       }
//     };

//     if (location) {
//       fetchDoctors();
//     }
//   }, [location]);

//   const StarRating = ({ rating }) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(
//         <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       );
//     }

//     if (hasHalfStar) {
//       stars.push(
//         <svg key="half" className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
//           <defs>
//             <linearGradient id="half-fill">
//               <stop offset="50%" stopColor="#FBBF24" />
//               <stop offset="50%" stopColor="#E5E7EB" />
//             </linearGradient>
//           </defs>
//           <path
//             fill="url(#half-fill)"
//             d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
//           />
//         </svg>
//       );
//     }

//     const emptyStars = 5 - Math.ceil(rating);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(
//         <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       );
//     }

//     return <div className="flex items-center gap-1">{stars}</div>;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
//           <p className="text-gray-600">
//             {keyword && `"${keyword}" in `}
//             <span className="font-semibold text-blue-600">{location}</span>
//           </p>
//           <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
//             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//               {doctors.length} doctors found
//             </span>
//           </div>
//         </div>

//         {doctors.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
//             <p className="text-gray-600">Try adjusting your search criteria or location.</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {doctors.map((doc) => (
//               <div
//                 key={doc.doctor_id}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start gap-6">
//                     {/* Profile Image */}
//                     <div className="flex-shrink-0">
//                       <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
//                         <img
//                           src={doc.profile_image}
//                           alt={`${doc.f_name} ${doc.l_name}`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/100';
//                           }}
//                         />
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between mb-3">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900 mb-1">
//                             {doc.prefix} {doc.f_name} {doc.l_name}
//                           </h3>
//                           <div className="flex items-center gap-3 mb-2">
//                             {doc.rating && (
//                               <div className="flex items-center gap-2">
//                                 <StarRating rating={doc.rating} />
//                                 <span className="text-sm font-medium text-gray-700">{doc.rating}</span>
//                               </div>
//                             )}
//                             <span className="text-sm text-gray-500">•</span>
//                             <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
//                               {doc.specialization?.map((s) => s.name).join(', ')}
//                             </span>
//                           </div>
//                         </div>

//                         {doc.consultation_fee && (
//                           <div className="text-right flex-shrink-0">
//                             <div className="text-2xl font-bold text-green-600">₹{doc.consultation_fee}</div>
//                             <div className="text-sm text-gray-500">Consultation Fee</div>
//                           </div>
//                         )}
//                       </div>

//                       {doc.bio && (
//                         <p className="text-gray-700 mb-4 leading-relaxed">{doc.bio}</p>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="flex items-center gap-3">
//                         <button
//                           onClick={() => navigate('/patient/booking', { state: { doctor: doc } })}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
//                         >
//                           Book Appointment
//                         </button>
//                         <button
//                           onClick={() => navigate('/doctor/profile', { state: { doctor: doc } })}
//                           className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
//                         >
//                           View Profile
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;



import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { 
  Search, 
  Phone, 
  MapPin, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  DollarSign, 
  Info,
  Calendar,
  Menu,
  X,
  ChevronDown,
  Hospital
} from 'lucide-react';

const DoctorSearchPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGender, setSelectedGender] = useState(['male']);
  const [selectedSpecialists, setSelectedSpecialists] = useState(['urology', 'neurology']);
  const [sortBy, setSortBy] = useState('');

  const doctors = [
    {
      id: 1,
      name: "Dr. Ruby Perrin",
      speciality: "MDS - Periodontology and Oral Implantology, BDS",
      department: "Dentist",
      rating: 4,
      reviews: 17,
      location: "Florida, USA",
      approval: "98%",
      feedback: "17 Feedback",
      priceRange: "$300 - $1000",
      services: ["Dental Fillings", "Whitening"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Darren Elder",
      speciality: "BDS, MDS - Oral & Maxillofacial Surgery",
      department: "Dentist",
      rating: 4,
      reviews: 35,
      location: "Newyork, USA",
      approval: "100%",
      feedback: "35 Feedback",
      priceRange: "$50 - $300",
      services: ["Dental Fillings", "Whitening"],
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Deborah Angel",
      speciality: "MBBS, MD - General Medicine, DNB - Cardiology",
      department: "Cardiology",
      rating: 4,
      reviews: 27,
      location: "Georgia, USA",
      approval: "99%",
      feedback: "35 Feedback",
      priceRange: "$100 - $400",
      services: ["Dental Fillings", "Whitening"],
      image: "https://images.unsplash.com/photo-1594824492608-b78583ff7b5c?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Dr. Sofia Brient",
      speciality: "MBBS, MS - General Surgery, MCh - Urology",
      department: "Urology",
      rating: 4,
      reviews: 4,
      location: "Louisiana, USA",
      approval: "97%",
      feedback: "4 Feedback",
      priceRange: "$150 - $250",
      services: ["Dental Fillings", "Whitening"],
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Dr. Katharine Berthold",
      speciality: "MS - Orthopaedics, MBBS, M.Ch - Orthopaedics",
      department: "Orthopaedics",
      rating: 4,
      reviews: 52,
      location: "Texas, USA",
      approval: "100%",
      feedback: "52 Feedback",
      priceRange: "$100 - $500",
      services: ["Dental Fillings", "Whitening"],
      image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const handleGenderChange = (gender) => {
    setSelectedGender(prev => 
      prev.includes(gender) 
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const handleSpecialistChange = (specialist) => {
    setSelectedSpecialists(prev => 
      prev.includes(specialist) 
        ? prev.filter(s => s !== specialist)
        : [...prev, specialist]
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>     

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <nav className="flex text-sm text-gray-500 mb-2">
                <a href="#" className="hover:text-gray-700">Home</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Search</span>
              </nav>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                2245 matches found for: Dentist In Bangalore
              </h2>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <span className="text-sm text-gray-600">Sort by</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="rating">Rating</option>
                <option value="popular">Popular</option>
                <option value="latest">Latest</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Search Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Search Filter</h3>
              
              {/* Date Filter */}
              <div className="mb-6">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Gender</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGender.includes('male')}
                      onChange={() => handleGenderChange('male')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Male Doctor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGender.includes('female')}
                      onChange={() => handleGenderChange('female')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Female Doctor</span>
                  </label>
                </div>
              </div>

              {/* Specialist Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Select Specialist</h4>
                <div className="space-y-2">
                  {['urology', 'neurology', 'dentist', 'orthopedic', 'cardiologist'].map((specialist) => (
                    <label key={specialist} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSpecialists.includes(specialist)}
                        onChange={() => handleSpecialistChange(specialist)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm capitalize">{specialist}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="space-y-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row">
                      {/* Doctor Info Left */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{doctor.speciality}</p>
                            <p className="text-sm font-medium text-blue-600 mb-2">{doctor.department}</p>
                            
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {renderStars(doctor.rating)}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">({doctor.reviews})</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              {doctor.location}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              {doctor.services.map((service, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Info Right */}
                      <div className="lg:ml-6 mt-4 lg:mt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                            <span>{doctor.approval}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{doctor.feedback}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            <span>{doctor.priceRange}</span>
                            <Info className="w-4 h-4 ml-1 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                            View Profile
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>  
     
    </div>
  );
};

export default DoctorSearchPage;
