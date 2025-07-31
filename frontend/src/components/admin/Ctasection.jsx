import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import BASE_URL from '../../config';
const IMAGE_BASE_URL = 'http://localhost:5000'


const token = localStorage.getItem('token');

const CtarManagement = () => {
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ name: '', website_url: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchPartners = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/partner/get-all?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(res.data.payload.data);
      setTotal(res.data.payload.total);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`${BASE_URL}/partner/toggle-status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPartners();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/partner/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPartners();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (partner) => {
    setCurrent(partner);
    setFormData({
      name: partner.name || '',
      website_url: partner.website_url || '',
      image: null,
    });

    const imageUrl = partner.image_url?.startsWith('http')
      ? partner.image_url
      : `${IMAGE_BASE_URL}${partner.image_url.startsWith('/') ? '' : '/'}${partner.image_url}`;
    setPreviewImage(imageUrl);

    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrent(null);
    setFormData({ name: '', website_url: '', image: null });
    setPreviewImage(null);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.image) data.append('image', formData.image);
    if (formData.name) data.append('name', formData.name);
    if (formData.website_url) data.append('website_url', formData.website_url);
    if (current?.id) data.append('id', current.id);

    try {
      await axios.post(`${BASE_URL}/partner/add-or-update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPartners();
      handleModalClose();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrent(null);
    setFormData({ name: '', website_url: '', image: null });
    setPreviewImage(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Compliance Management</h2>
          <p className="text-gray-600 text-sm">Dashboard / Compliance</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 border border-cyan-500 rounded-lg text-white bg-cyan-500 text-sm cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              Add Compliance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.N</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner, idx) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-6 py-4">
                      {partner.image_url && (
                        <img
                          src={`${IMAGE_BASE_URL}${partner.image_url}`}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer"
                          alt="logo"
                          onClick={() =>
                            setSelectedImage(
                              partner.image_url.startsWith('http')
                                ? partner.image_url
                                : `${IMAGE_BASE_URL}${partner.image_url.startsWith('/') ? '' : '/'}${partner.image_url}`
                            )
                          }
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{partner.name || '--'}</td>
                    <td className="px-6 py-4 text-sm">
                      {partner.website_url ? (
                        <a href={partner.website_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          {partner.website_url}
                        </a>
                      ) : '--'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        onClick={() => handleToggleStatus(partner.id)}
                        className={`px-2 py-1 rounded-full text-xs cursor-pointer ${
                          partner.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {partner.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button onClick={() => handleEdit(partner)} className="cursor-pointer px-3 py-1 bg-yellow-500 text-white rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(partner.id)} className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
           <div className="text-sm text-gray-700">
              Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevious} disabled={page === 1} className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center">{page}</span>
              <button onClick={handleNext} disabled={page === totalPages} className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {current ? 'Edit Compliance' : 'Add New Compliance'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Optional"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Optional"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Compliance Logo</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-16 h-16 mt-2 rounded object-cover border" />
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={handleModalClose} className="px-4 py-2 text-cyan-500 border border-cyan-500 cursor-pointer rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded cursor-pointer">
                    {current ? 'Save Changes' : 'Add Compliance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setSelectedImage(null)}>
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl w-full relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
              <img src={selectedImage} alt="Full View" className="w-full h-auto object-contain rounded" />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CtarManagement;
