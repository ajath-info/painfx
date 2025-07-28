import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BASE_URL from '../../config';

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < Math.round(parseFloat(rating)) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
};

const SortIcon = () => (
  <svg
    className="inline w-4 h-4 ml-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
);

const Reviews = () => {
  const [reviewData, setReviewData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view reviews.');
        return;
      }

      const response = await fetch(`${BASE_URL}/rating/reviews?page=${currentPage}&limit=${entriesPerPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const result = await response.json();
      if (result.error || result.status !== 1) {
        throw new Error(result.message || 'Error fetching reviews');
      }

      const mappedReviews = result.payload.data.map(review => ({
        id: review.id.toString(),
        patientName: review.user_name || 'Unknown Patient',
        patientImg: review.user_image || 'https://picsum.photos/id/237/50/50',
        doctorName: review.doctor_name || 'Unknown Doctor',
        doctorImg: review.doctor_image || 'https://picsum.photos/id/257/50/50',
        rating: parseFloat(review.rating) || 0,
        description: review.review || 'No description provided',
        date: new Date(review.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        isActive: review.status !== "2",
        isTestimonial: review.is_testimonial === "1" || false, // Default to 0 if not "1"
      }));

      setReviewData(mappedReviews);
      setTotalPages(Math.ceil(result.payload.total / entriesPerPage));
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, entriesPerPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to perform this action.');
        return;
      }

      const newStatus = !currentStatus;
      const response = await fetch(`${BASE_URL}/rating/toggle/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle review status');
      }

      await fetchReviews();
    } catch (err) {
      setError(err.message || 'An error occurred while toggling review status.');
    }
  };

  const handleToggleTestimonial = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to perform this action.');
        return;
      }

      const newStatus = !currentStatus ? 1 : 0; // Toggle between 0 and 1
      const response = await fetch(`${BASE_URL}/rating/testimonial/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_testimonial: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle testimonial status');
      }

      await fetchReviews();
    } catch (err) {
      setError(err.message || 'An error occurred while toggling testimonial status.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Reviews</h2>
          <p className="text-gray-600">Dashboard / Reviews</p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <span className="text-gray-700">entries</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor Name
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ratings
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Testimonial
                      <SortIcon />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviewData.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={review.patientImg}
                            alt={`${review.patientName}'s profile`}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <span>{review.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={review.doctorImg}
                            alt={`${review.doctorName}'s profile`}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <span>{review.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={review.description}>
                          {review.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {review.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleToggleActive(review.id, review.isActive)}
                          className={`px-3 py-1 rounded transition-colors flex items-center ${review.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {review.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleToggleTestimonial(review.id, review.isTestimonial)}
                          className={`px-3 py-1 rounded transition-colors flex items-center ${review.isTestimonial ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          {review.isTestimonial ? 'Yes' : 'No'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
                {Math.min(currentPage * entriesPerPage, reviewData.length)} of{' '}
                {reviewData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  {currentPage}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reviews;