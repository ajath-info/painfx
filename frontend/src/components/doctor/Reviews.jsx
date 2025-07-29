import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import BASE_URL from '../../config';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // API configuration

  const API_ENDPOINT = `${BASE_URL}/rating/my-doctor-reviews`;

  // Function to get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Function to fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      // Transform API data to match component structure
  const transformedReviews = data.payload.data.map(review => ({
        id: review.id,
        patientName: review.user_name || 'Anonymous',
        rating: review.rating,
        comment: review.review || review.title || 'No comment provided',
        date: new Date(review.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        avatar: review.user_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name || 'Anonymous')}&background=random`,
        title: review.title,
        appointmentId: review.appointment_id
      }));

      setReviews(transformedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Loading component
  if (loading) {
    return (
      <DoctorLayout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading reviews...</span>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  // Error component
  if (error) {
    return (
      <DoctorLayout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <i className="fa-solid fa-exclamation-triangle text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Reviews</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full divide-y divide-gray-200">
              {currentReviews.map((review) => (
                <div key={review.id} className="p-6 border-b border-gray-200 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={review.avatar}
                        alt={review.patientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.patientName)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{review.patientName}</h3>
                          <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                          {review.title && (
                            <p className="text-sm font-medium text-gray-700 mt-1">{review.title}</p>
                          )}
                        </div>
                        <div className="flex space-x-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-600 mt-3">{review.comment}</p>

                      {/* <div className="mt-4 flex space-x-2 justify-end">
                        <button className="px-3 py-1 text-xl">
                          Recommend?
                        </button>
                        <button className="px-3 py-1 border border-gray-500 text-gray-500 text-lg hover:bg-gray-50">
                          <i className="fa-solid fa-thumbs-up"></i> Yes
                        </button>
                        <button className="px-3 py-1 border border-gray-500 text-gray-500 text-lg hover:bg-gray-50">
                          <i className="fa-solid fa-thumbs-down"></i> No
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}

              {currentReviews.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-4">
                    <i className="fa-solid fa-star text-4xl text-gray-300"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">You haven't received any reviews from patients yet.</p>
                </div>
              )}
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, reviews.length)} of {reviews.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-cyan-500 px-4 py-2 rounded hover:bg-cyan-500 hover:text-white border border-cyan-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-cyan-500 rounded text-sm border border-cyan-500 cursor-pointer">
                  {currentPage}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-cyan-500 rounded disabled:opacity-50 disabled:cursor-not-allowed text-cyan-500 px-4 py-2 rounded hover:bg-cyan-500 hover:text-white border border-cyan-500 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Reviews;