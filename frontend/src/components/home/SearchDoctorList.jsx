import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  DollarSign, 
  Info,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import BASE_URL from '../../config';

// Placeholder for Header and Footer (replace with actual imports)
import Header from '../common/Header';
import Footer from '../common/Footer';

const DoctorSearchPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract location and keyword from query parameters
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('location') || ''; // Keep 'location' for URL
  const keyword = queryParams.get('keyword') || '';

  useEffect(() => {
    if (city) {
      fetchDoctors(1);
      setPage(1); // Reset page on city change
    }
  }, [city, keyword]);

  const fetchDoctors = async (pageNum, append = false) => {
    setIsLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ city, page: pageNum, limit: 10 }); // API expects 'city'
      if (keyword) query.append('keyword', keyword);
      const response = await fetch(`${BASE_URL}/clinics?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) {
        throw new Error(data.message || 'Failed to fetch doctors');
      }

      // Transform fetchedDoctor into UI-compatible format
      const transformedDoctors = (data.payload.fetchedDoctor || []).map(doctor => ({
        id: doctor.id,
        name: doctor.full_name,
        speciality: doctor.speciality || 'General Practice',
        department: doctor.department || 'General',
        rating: doctor.rating || 4,
        reviews: doctor.reviews || 0,
        approval: doctor.approval || '95%',
        feedback: doctor.feedback || '0 Feedback',
        priceRange: doctor.price_range || '100-500',
        consultationFee: doctor.consultation_fee ? Number(doctor.consultation_fee) : null,
        consultationFeeType: doctor.consultation_fee_type || 'paid',
        services: doctor.services ? JSON.parse(doctor.services) : ['General Consultation'],
        image: doctor.profile_image || null,
        gender: doctor.gender || 'male',
        isApproved: doctor.is_approved || false,
        bio: doctor.bio || null,
        doctorCity: doctor.city || null,
        doctorState: doctor.state || null,
        address_line1: doctor.address_line1 || '',
        phone: `${doctor.phone_code || ''}${doctor.phone || ''}`
      }));

      // Append or replace doctors based on pagination
      setDoctors(prev => append ? [...prev, ...transformedDoctors] : transformedDoctors);
      setHasMore((data.payload.fetchedDoctor || []).length === 10); // Assume limit=10
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.message || 'Failed to load data');
      setDoctors([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

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
    const numRating = Number(rating) || 0;
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const availableSpecialists = [...new Set(
    doctors.map(doctor => doctor.department?.toLowerCase()).filter(Boolean)
  )];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialist = selectedSpecialists.length === 0 || 
      selectedSpecialists.some(spec => 
        doctor.department?.toLowerCase().includes(spec.toLowerCase())
      );
    const matchesGender = selectedGender.length === 0 || 
      selectedGender.includes(doctor.gender?.toLowerCase());
    const matchesKeyword = !keyword || 
      doctor.name?.toLowerCase().includes(keyword.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(keyword.toLowerCase()) ||
      doctor.department?.toLowerCase().includes(keyword.toLowerCase());
    return matchesSpecialist && matchesGender && matchesKeyword;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    if (sortBy === 'popular') return (Number(b.reviews) || 0) - (Number(a.reviews) || 0);
    if (sortBy === 'latest') return b.id - a.id;
    if (sortBy === 'free') {
      const aFree = a.consultationFeeType === 'free' ? 0 : (Number(a.consultationFee) || 1000);
      const bFree = b.consultationFeeType === 'free' ? 0 : (Number(b.consultationFee) || 1000);
      return aFree - bFree;
    }
    return 0;
  });

  const handleViewProfile = (doctorId) => {
    navigate(`doctor-profile/${doctorId}`); // Changed to 'location'
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}?location=${encodeURIComponent(city)}`); // Changed to 'location'
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDoctors(nextPage, true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <nav className="flex text-sm text-gray-500 mb-2">
                <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Search</span>
              </nav>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {sortedDoctors.length} matches found for: Doctors in {city || 'Unknown City'}
                {keyword && `, ${keyword}`}
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
                <option value="free">Fee (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading doctors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchDoctors(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Search Filter</h3>
                
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

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Select Specialist</h4>
                  <div className="space-y-2">
                    {availableSpecialists.length > 0 ? (
                      availableSpecialists.map((specialist) => (
                        <label key={specialist} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSpecialists.includes(specialist)}
                            onChange={() => handleSpecialistChange(specialist)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm capitalize">{specialist}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No specialists available</p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    // Filters are applied automatically via state
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 mt-8 lg:mt-0">
              {sortedDoctors.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">No doctors found in {city}</p>
                  <p className="text-sm">Try adjusting your filters or search in a different city.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <User className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Doctors in {city}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {city}
                      </div>
                      <h4 className="text-md font-medium text-gray-700 mb-4">Available Doctors</h4>
                      <div className="space-y-6">
                        {sortedDoctors.map(doctor => (
                          <div key={doctor.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                            <div className="flex flex-col lg:flex-row">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row">
                                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                                    {doctor.image ? (
                                      <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-24 h-24 rounded-lg object-cover"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div className={`w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center ${doctor.image ? 'hidden' : ''}`}>
                                      <User className="w-12 h-12 text-gray-400" />
                                    </div>
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
                                      <span className="ml-2 text-sm text-gray-500">
                                        ({doctor.reviews} reviews)
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {doctor.doctorCity}, {doctor.doctorState}
                                    </div>
                                    {doctor.services && doctor.services.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {doctor.services.map((service, index) => (
                                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {service}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    {doctor.bio && (
                                      <p className="text-sm text-gray-600 mt-2">{doctor.bio}</p>
                                    )}
                                    {doctor.phone && (
                                      <p className="text-sm text-gray-600 mt-2">Contact: {doctor.phone}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
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
                                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                                    <span>
                                      {doctor.consultationFeeType === 'free' 
                                        ? 'Free Consultation' 
                                        : `₹${doctor.consultationFee || doctor.priceRange}`}
                                    </span>
                                    <Info className="w-4 h-4 ml-1 text-gray-400" />
                                  </div>
                                  {doctor.isApproved && (
                                    <div className="flex items-center text-sm text-green-600">
                                      <ThumbsUp className="w-4 h-4 mr-2" />
                                      <span>Verified Doctor</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button 
                                    onClick={() => handleViewProfile(doctor.id)}
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                  >
                                    View Profile
                                  </button>
                                  <button 
                                    onClick={() => handleBookAppointment(doctor.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    Book Appointment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {sortedDoctors.length > 0 && hasMore && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DoctorSearchPage;