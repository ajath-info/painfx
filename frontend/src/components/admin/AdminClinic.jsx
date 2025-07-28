import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Edit, Trash2, ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';
import BASE_URL from '../../config';
const token = localStorage.getItem("token");

const defaultForm = {
  name: '',
  country: '',
  state: '',
  city: '',
  address_line1: '',
  address_line2: '',
  email: '',
  password: '', // required only on create
  gallery: [],  // File[] for new uploads
  pin_code: '', // Added pin_code field
};

const ClinicManagement = () => {
  const [clinics, setClinics] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null); // clinic object when editing
  const [formData, setFormData] = useState(defaultForm);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // {id,url,existing,file?}[]

  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clinic/get-all?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === 1) {
        const rows = res.data.payload || [];
        setClinics(rows);
        setTotal(res.data.payload.length > 0 ? res.data.payload.length : 0); // Update total based on payload length or API total if provided
      } else {
        console.error('API error:', res.data.message);
        setClinics([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Fetch clinics error:', err);
      setClinics([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [page, limit]);

  const absolutize = (maybeUrl) => {
    if (!maybeUrl) return '';
    if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) return maybeUrl;
    return BASE_URL + (maybeUrl.startsWith('/') ? '' : '/') + maybeUrl;
  };

  const buildAddress = (c) => {
    const segs = [c.country, c.state, c.city].filter(Boolean).join(' > ');
    const lines = [c.address_line1, c.address_line2].filter(Boolean).join(', ');
    return [segs, lines].filter(Boolean).join(' | ');
  };

  const handlePrevious = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const openAddModal = () => {
    setCurrent(null);
    setFormData(defaultForm);
    setGalleryPreviews([]);
    setModalOpen(true);
  };

  const openEditModal = (clinic) => {
    setCurrent(clinic);
    setFormData({
      name: clinic.name || '',
      country: clinic.country || '',
      state: clinic.state || '',
      city: clinic.city || '',
      address_line1: clinic.address_line1 || '',
      address_line2: clinic.address_line2 || '',
      email: clinic.email || '',
      password: '', // cleared so user can optionally change
      gallery: [], // new uploads only
      pin_code: clinic.pin_code || '', // Populate pin_code from clinic data
    });

    // Ensure clinic.gallery is an array before mapping
    const galleryArray = Array.isArray(clinic.gallery) ? clinic.gallery : [];
    const previews = galleryArray.map((url, i) => ({
      id: 'existing-' + i,
      url: absolutize(url),
      existing: true,
    }));
    setGalleryPreviews(previews);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Add to formData.gallery
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.concat(files) }));

    // Add to previews (new)
    const newPreviews = files.map((file) => ({
      id: 'new-' + file.name + '-' + file.lastModified,
      url: URL.createObjectURL(file),
      existing: false,
      file: file,
    }));
    setGalleryPreviews((prev) => prev.concat(newPreviews));
  };

  const removePreview = (id) => {
    setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((f) => 'new-' + f.name + '-' + f.lastModified !== id),
    }));
  };

  const handleUpdate = async (clinicId, updatedData) => {
    try {
      const data = new FormData();
      data.append('clinic_id', clinicId);
      data.append('name', updatedData.name);
      data.append('address_line1', updatedData.address_line1);
      data.append('address_line2', updatedData.address_line2);
      data.append('city', updatedData.city);
      data.append('state', updatedData.state);
      data.append('country', updatedData.country);
      data.append('pin_code', updatedData.pin_code || ''); // Added pin_code
      data.append('lat', updatedData.lat || '');
      data.append('lng', updatedData.lng || '');

      // Handle gallery updates
      if (updatedData.gallery.length > 0) {
        updatedData.gallery.forEach((file) => data.append('gallery', file));
      }

      // Handle gallery removal
      const removedGallery = galleryPreviews
        .filter((preview) => preview.existing && !galleryPreviews.some((p) => p.id === preview.id))
        .map((preview) => preview.url.replace(BASE_URL, ''));
      if (removedGallery.length > 0) {
        data.append('removeGallery', JSON.stringify(removedGallery));
      }

      if (updatedData.email) data.append('email', updatedData.email);
      if (updatedData.password && updatedData.password.trim()) data.append('password', updatedData.password);

      await axios.put(`${BASE_URL}/clinic/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchClinics();
    } catch (err) {
      console.error('Update clinic error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic required validation
    const requiredFields = ['name', 'country', 'state', 'city', 'address_line1', 'email'];
    for (let i = 0; i < requiredFields.length; i++) {
      const f = requiredFields[i];
      if (!formData[f] || !formData[f].trim()) {
        alert('Please enter ' + f.replace('_', ' ') + '.');
        return;
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!current && !formData.password.trim()) {
      alert('Password is required when adding a clinic.');
      return;
    }

    const data = new FormData();
    if (current && current.id) {
      await handleUpdate(current.id, formData);
    } else {
      data.append('name', formData.name);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('city', formData.city);
      data.append('address_line1', formData.address_line1);
      data.append('address_line2', formData.address_line2);
      data.append('email', formData.email);
      if (formData.password.trim()) data.append('password', formData.password);
      if (formData.pin_code) data.append('pin_code', formData.pin_code); // Added pin_code

      // Append gallery files (multi)
      formData.gallery.forEach((file) => data.append('gallery', file)); // backend: multer.array('gallery')

      try {
        await axios.post(`${BASE_URL}/auth/clinic-register`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchClinics();
        closeModal();
      } catch (err) {
        console.error('Submit clinic error:', err);
      }
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this clinic? This cannot be undone.')) return;
    try {
      await axios.put(`${BASE_URL}/clinic/update`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClinics();
    } catch (err) {
      console.error('Delete clinic error:', err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrent(null);
    setFormData(defaultForm);
    setGalleryPreviews([]);
  };

  const inputBase = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 placeholder-gray-400';

  const summaryLocation = useMemo(() => {
    const parts = [formData.city, formData.state, formData.country].filter(Boolean);
    return parts.join(', ');
  }, [formData.city, formData.state, formData.country]);

  const summaryAddress = useMemo(() => {
    const parts = [formData.address_line1, formData.address_line2].filter(Boolean);
    return parts.join(', ');
  }, [formData.address_line1, formData.address_line2]);

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Clinic Management</h2>
          <p className="text-gray-600 text-sm">Dashboard / Clinics</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add Clinic
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.N</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clinics.map((clinic, idx) => (
                  <tr key={clinic.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{clinic.name || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs break-words">{buildAddress(clinic) || '--'}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 underline">{
                      clinic.email ? (
                        <a href={'mailto:' + clinic.email}>{clinic.email}</a>
                      ) : (
                        '--'
                      )
                    }</td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button
                        onClick={() => openEditModal(clinic)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(clinic.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {clinics.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No clinics found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-700">
              Showing {total ? startIndex + 1 : 0} to {Math.min(endIndex, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevious} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">{page}</span>
              <button onClick={handleNext} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{current ? 'Edit Clinic' : 'Add New Clinic'}</h3>
                  <p className="text-sm text-gray-500 mt-1">Fill out the form below to {current ? 'update' : 'create'} a clinic.</p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Clinic Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Vitalplus Clinic"
                      className={inputBase}
                      required
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email<span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      className={inputBase}
                      required
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password{!current && <span className="text-red-500">*</span>}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={current ? 'Leave blank to keep current password' : 'Enter password'}
                      className={inputBase}
                      required={!current}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-700">Clinic Logo / Gallery</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-500 text-sm gap-2">
                      <ImagePlus className="w-6 h-6 text-gray-400" />
                      <span>Select File</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500">Drop files here to upload</p>
                  </div>

                  {galleryPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {galleryPreviews.map((img) => (
                        <div key={img.id} className="relative group w-full aspect-square bg-gray-100 rounded overflow-hidden">
                          <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePreview(img.id)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={img.existing ? 'Remove from preview (does not delete on server)' : 'Remove'}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-700">Full Clinic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Country<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                        className={inputBase}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">State<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className={inputBase}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">City<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className={inputBase}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        placeholder="Street, building number"
                        className={inputBase}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        placeholder="Apartment / suite / landmark"
                        className={inputBase}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={handleInputChange}
                        placeholder="Enter postal code"
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-md transition"
                  >
                    {current ? 'Save Changes' : 'Add Clinic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ClinicManagement;