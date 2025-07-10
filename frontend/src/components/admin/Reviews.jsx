import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const reviews = [
  {
    id: '#RV001',
    patientName: 'John Doe',
    patientImg: 'https://picsum.photos/id/237/50/50',
    doctorName: 'Dr. Ruby Perrin',
    doctorImg: 'https://picsum.photos/id/257/50/50',
    rating: 4,
    description: 'Great service, very professional and caring.',
    date: 'Jan 15, 2025',
  },
  {
    id: '#RV002',
    patientName: 'Jane Smith',
    patientImg: 'https://picsum.photos/id/238/50/50',
    doctorName: 'Dr. Darren Elder',
    doctorImg: 'https://picsum.photos/id/258/50/50',
    rating: 5,
    description: 'Excellent experience, highly recommend!',
    date: 'Feb 10, 2025',
  },
  {
    id: '#RV003',
    patientName: 'Emily Johnson',
    patientImg: 'https://picsum.photos/id/239/50/50',
    doctorName: 'Dr. Deborah Angel',
    doctorImg: 'https://picsum.photos/id/259/50/50',
    rating: 3,
    description: 'Good, but could improve communication.',
    date: 'Mar 5, 2025',
  },
  {
    id: '#RV004',
    patientName: 'Michael Brown',
    patientImg: 'https://picsum.photos/id/240/50/50',
    doctorName: 'Dr. Sofia Brient',
    doctorImg: 'https://picsum.photos/id/260/50/50',
    rating: 4,
    description: 'Very thorough and helpful consultation.',
    date: 'Apr 20, 2025',
  },
  {
    id: '#RV005',
    patientName: 'Sarah Davis',
    patientImg: 'https://picsum.photos/id/241/50/50',
    doctorName: 'Dr. Marvin Campbell',
    doctorImg: 'https://picsum.photos/id/261/50/50',
    rating: 2,
    description: 'Average service, nothing special.',
    date: 'May 12, 2025',
  },
  {
    id: '#RV006',
    patientName: 'David Wilson',
    patientImg: 'https://picsum.photos/id/242/50/50',
    doctorName: 'Dr. Ruby Perrin',
    doctorImg: 'https://picsum.photos/id/257/50/50',
    rating: 5,
    description: 'Outstanding care, very satisfied!',
    date: 'Jun 8, 2025',
  },
  {
    id: '#RV007',
    patientName: 'Laura Martinez',
    patientImg: 'https://picsum.photos/id/243/50/50',
    doctorName: 'Dr. Darren Elder',
    doctorImg: 'https://picsum.photos/id/258/50/50',
    rating: 4,
    description: 'Friendly staff and good treatment.',
    date: 'Jul 1, 2025',
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
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
  const [reviewData, setReviewData] = useState(reviews);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(reviewData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentReviews = reviewData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  const handleDelete = (id) => {
    // Delete functionality with confirmation
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviewData(reviewData.filter(review => review.id !== id));
      console.log(`Delete review ${id}`);
    }
  };


  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Reviews</h2>
          <p className="text-gray-600">Dashboard / Reviews</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Entries */}
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

          {/* Table */}
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
                    Actions
                    <SortIcon />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReviews.map((review) => (
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, reviewData.length)} of{' '}
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
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reviews;