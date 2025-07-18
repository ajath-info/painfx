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