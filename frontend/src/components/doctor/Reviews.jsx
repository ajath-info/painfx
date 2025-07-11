import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const dummyReviews = [
    { id: 1, patientName: 'John Doe', rating: 4, comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '2025-07-10', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { id: 2, patientName: 'Jane Smith', rating: 5, comment: 'Ut enim ad minim veniam, quis nostrud exercitation.', date: '2025-07-09', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { id: 3, patientName: 'Robert Wilson', rating: 3, comment: 'Curabitur non nulla sit amet nisl tempus.', date: '2025-07-08', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
    { id: 4, patientName: 'Emily Johnson', rating: 5, comment: 'Highly recommended!', date: '2025-07-07', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 5, patientName: 'Michael Brown', rating: 4, comment: 'Very satisfied.', date: '2025-07-06', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
    { id: 6, patientName: 'Sarah Parker', rating: 5, comment: 'Exceptional care provided.', date: '2025-07-05', avatar: 'https://randomuser.me/api/portraits/women/66.jpg' },
  ];

  useEffect(() => {
    setReviews(dummyReviews);
  }, []);

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

  return (
    <DoctorLayout>
    <div >

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
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.patientName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                      </div>
                      <div className="flex space-x-1 mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <i class="fa-solid fa-star"></i>
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 mt-3">{review.comment}</p>

                    <div className="mt-4 flex space-x-2 justify-end ">
                      <button className="px-3 py-1 text-xl">
                        Recommend?
                      </button>
                      <button className="px-3 py-1 border border-gray-500 text-gray-500  text-lg">
                       <i class="fa-solid fa-thumbs-up"></i> Yes
                      </button>
                      <button className="px-3 py-1 border border-gray-500 text-gray-500  text-lg">
                       <i class="fa-solid fa-thumbs-down"></i> No
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {currentReviews.length === 0 && (
              <div className="p-4 text-center text-gray-500">No reviews found.</div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, reviews.length)} of {reviews.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    </DoctorLayout>
  );
};

export default Reviews;