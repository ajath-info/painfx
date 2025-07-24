import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClinicLayout from '../../layouts/ClinicLayout';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SortIcon = () => (
  <svg
    className="inline w-4 h-4 ml-1 text-gray-500"
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

const SpecialtiesManagement = () => {
  const [specialtyData, setSpecialtyData] = useState([]);
  const [totalSpecialties, setTotalSpecialties] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', image: '', status: 'Active', doctors: 0 });
  const [formErrors, setFormErrors] = useState({ code: '', name: '', image: '', doctors: '' });

  const token = 'your_token_here'; // Replace with your token

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('https://painfx-2.onrender.com/api/specialty/get-all', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: entriesPerPage, status: 1 },
      });
      const result = response.data.payload;
      setSpecialtyData(result.data);
      setTotalSpecialties(result.total);
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
    }
  };

  useEffect(() => { fetchSpecialties(); }, [currentPage, entriesPerPage]);

  const totalPages = Math.ceil(totalSpecialties / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentSpecialties = specialtyData.slice(0, entriesPerPage);

  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  const handleEdit = (spec) => {
    setCurrentSpecialty(spec);
    setFormData({
      code: spec.code || '',
      name: spec.name || '',
      image: spec.image_url ? `https://painfx-2.onrender.com${spec.image_url}` : '',
      status: spec.status === '1' ? 'Active' : 'Inactive',
      doctors: spec.doctor_count || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSpecialtyData((prevData) => prevData.filter((spec) => spec.id !== id));
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Add form validation if needed
    try {
      const payload = {
        name: formData.name,
        image_url: formData.image,
        code: formData.code,
        status: formData.status === 'Active' ? '1' : '0',
      };
      await axios.post('https://painfx-2.onrender.com/api/specialty/add-or-update', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSpecialties();
      handleModalClose();
    } catch (error) {
      console.error('Failed to save specialty:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentSpecialty(null);
    setFormData({ code: '', name: '', image: '', status: 'Active', doctors: 0 });
  };

  return (
    <ClinicLayout>
      <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Specialties Management</h2>
          <p className="text-gray-600 text-sm">Dashboard / Specialties</p>
        </div>

        {/* Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={() => { setCurrentSpecialty(null); setIsModalOpen(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Add Specialty
            </button>
          </div>

          {/* Table (hidden on mobile) */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {['Specialty Code', 'Specialty Name', 'Status', 'Doctors', 'Actions'].map((header, idx) => (
                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header} <SortIcon />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSpecialties.map((spec) => (
                  <tr key={spec.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm">{spec.code}</td>
                    <td className="px-6 py-4 text-sm flex items-center">
                      <img
                        src={spec.image_url ? `https://painfx-2.onrender.com${spec.image_url}` : '/default-image.jpg'}
                        alt={spec.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      {spec.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${spec.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {spec.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{spec.doctors}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleEdit(spec)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(spec.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card Layout for Mobile */}
          <div className="block md:hidden p-4 space-y-4">
            {currentSpecialties.map((spec) => (
              <div key={spec.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <img
                    src={spec.image_url ? `https://painfx-2.onrender.com${spec.image_url}` : '/default-image.jpg'}
                    alt={spec.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <h3 className="text-lg font-semibold">{spec.name}</h3>
                </div>
                <p className="text-sm"><span className="font-medium">Code:</span> {spec.code}</p>
                <p className="text-sm"><span className="font-medium">Doctors:</span> {spec.doctors}</p>
                <p className="text-sm"><span className="font-medium">Status:</span> {spec.status === '1' ? 'Active' : 'Inactive'}</p>
                <div className="flex space-x-2 mt-3">
                  <button onClick={() => handleEdit(spec)} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(spec.id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, specialtyData.length)} of {specialtyData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevious} disabled={currentPage === 1} className="px-3 py-1.5 border rounded-lg text-sm">
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>
              <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1.5 border rounded-lg text-sm">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">{currentSpecialty ? 'Edit Specialty' : 'Add New Specialty'}</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Specialty Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={handleModalClose} className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    {currentSpecialty ? 'Save Changes' : 'Add Specialty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ClinicLayout>
  );
};

export default SpecialtiesManagement;