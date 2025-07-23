import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import BASE_URL from '../../config';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../common/Loader';
import { Edit, Trash2, ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';

const token = localStorage.getItem('token');

const defaultForm = {
  prefix: 'Dr',
  f_name: '',
  l_name: '',
  phone: '',
  phone_code: '+61',
  DOB: '',
  gender: 'male',
  bio: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: '',
  pin_code: '',
  consultation_fee_type: 'free',
  consultation_fee: 0,
  email: '',
  password: '',
  gallery: [], // File[] for new profile images
};

function DoctorProfileForm({ mode = 'add', doctorId = null, onCancel, onSaved }) {
  const [formData, setFormData] = useState(defaultForm);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // {id, url, existing, file?}[]
  const [services, setServices] = useState(['Tooth cleaning']);
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [educations, setEducations] = useState([{ degree: '', college: '', year: '' }]);
  const [experiences, setExperiences] = useState([{ hospital: '', from: '', to: '', designation: '' }]);
  const [awards, setAwards] = useState([{ award: '', year: '' }]);
  const [memberships, setMemberships] = useState(['']);
  const [registrations, setRegistrations] = useState([{ registration: '', year: '' }]);
  const [clinics, setClinics] = useState([]);
  const [availableClinics, setAvailableClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch user role from token
  const getUserRole = () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.role;
    } catch (e) {
      return null;
    }
  };

  // Search specializations with debounce
  const searchSpecializations = useCallback(
    debounce(async (query) => {
      try {
        if (!token) {
          setMessage('Authentication token not found. Please login again.');
          setAvailableSpecializations([]);
          return;
        }
        if (!query) {
          setAvailableSpecializations(allSpecializations);
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/doctor/search-specialization?search=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const specializationsData = Array.isArray(response.data.payload)
          ? response.data.payload
          : Array.isArray(response.data)
          ? response.data
          : [];
        setAvailableSpecializations(specializationsData);
      } catch (err) {
        setMessage(`Error searching specializations: ${err.response?.data?.message || err.message}`);
        setAvailableSpecializations([]);
      }
    }, 500),
    [allSpecializations]
  );

  // Fetch clinic details
  const fetchClinicDetails = async (clinicId) => {
    try {
      const response = await axios.get(`${BASE_URL}/clinic/get/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 1) {
        setClinics([response.data.payload]);
      } else {
        setMessage('Error fetching clinic details.');
      }
    } catch (err) {
      setMessage(`Error fetching clinic details: ${err.response?.data?.message || err.message}`);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!token) {
          setMessage('Authentication token not found. Please login again.');
          setIsLoading(false);
          return;
        }

        const role = getUserRole();
        if (role === 'admin') {
          const clinicsRes = await axios.get(`${BASE_URL}/clinic/search-active-clinics`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (clinicsRes.data.status === 1) {
            setAvailableClinics(clinicsRes.data.payload || []);
            setClinics([]);
          }
        } else if (role === 'clinic') {
          const clinicRes = await axios.get(`${BASE_URL}/clinic/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (clinicRes.data.status === 1) {
            setClinics([]);
            setSelectedClinicId(clinicRes.data.payload.id || '');
            await fetchClinicDetails(clinicRes.data.payload.id);
          }
        }

        const specsRes = await axios.get(`${BASE_URL}/doctor/get-specializations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const specializationsData = Array.isArray(specsRes.data.payload)
          ? specsRes.data.payload
          : Array.isArray(specsRes.data)
          ? specsRes.data
          : [];
        setAllSpecializations(specializationsData);
        setAvailableSpecializations(specializationsData);

        if (mode === 'edit' && doctorId) {
          await loadDoctorProfile(doctorId);
        } else {
          setIsLoading(false);
        }
        setMessage('');
      } catch (err) {
        setMessage(`Error fetching initial data: ${err.response?.data?.message || err.message}`);
        setAllSpecializations([]);
        setAvailableSpecializations([]);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [mode, doctorId]);

  useEffect(() => {
    searchSpecializations(searchQuery);
  }, [searchQuery, searchSpecializations]);

  useEffect(() => {
    if (selectedClinicId && getUserRole() === 'admin') {
      fetchClinicDetails(selectedClinicId);
    }
  }, [selectedClinicId]);

  // Load doctor profile for edit mode
  const loadDoctorProfile = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/doctor-profile?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.payload.doctor || {};
      setFormData({
        prefix: data.prefix || 'Dr',
        f_name: data.f_name || '',
        l_name: data.l_name || '',
        phone: data.phone || '',
        phone_code: data.phone_code || '+61',
        DOB: data.DOB || '',
        gender: data.gender || 'male',
        bio: data.bio || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        pin_code: data.pin_code || '',
        consultation_fee_type: data.consultation_fee && data.consultation_fee > 0 ? 'paid' : 'free',
        consultation_fee: data.consultation_fee || 0,
        email: data.email || '',
        password: '',
        gallery: [],
      });

      const galleryArray = Array.isArray(data.profile_image) ? data.profile_image : data.profile_image ? [data.profile_image] : [];
      const previews = galleryArray.map((url, i) => ({
        id: 'existing-' + i,
        url: url.startsWith('http') ? url : `${BASE_URL}/${url}`,
        existing: true,
      }));
      setGalleryPreviews(previews);

      if (Array.isArray(res.data.payload.services) && res.data.payload.services.length) setServices(res.data.payload.services);
      if (Array.isArray(res.data.payload.specializations)) setSpecializations(res.data.payload.specializations.map((s) => s.id));
      if (Array.isArray(res.data.payload.educations) && res.data.payload.educations.length)
        setEducations(
          res.data.payload.educations.map((e) => ({
            degree: e.degree || '',
            institution: e.institution || '',
            year: e.year_of_passing ? String(e.year_of_passing) : '',
          }))
        );
      if (Array.isArray(res.data.payload.experiences) && res.data.payload.experiences.length)
        setExperiences(
          res.data.payload.experiences.map((x) => ({
            hospital: x.hospital || '',
            from: x.start_date || '',
            to: x.end_date || '',
            designation: x.designation || '',
          }))
        );
      if (Array.isArray(res.data.payload.awards) && res.data.payload.awards.length)
        setAwards(
          res.data.payload.awards.map((a) => ({
            award: a.title || '',
            year: a.year ? String(a.year) : '',
          }))
        );
      if (Array.isArray(res.data.payload.memberships) && res.data.payload.memberships.length)
        setMemberships(res.data.payload.memberships.map((m) => m.text || ''));
      if (res.data.payload.registration)
        setRegistrations([{ registration: res.data.payload.registration.registration_number, year: res.data.payload.registration.registration_date || '' }]);
      if (Array.isArray(res.data.payload.clinics) && res.data.payload.clinics.length > 0) {
        setSelectedClinicId(res.data.payload.clinics[0].id || '');
        await fetchClinicDetails(res.data.payload.clinics[0].id);
      }
      setIsLoading(false);
    } catch (err) {
      setMessage(`Error loading doctor profile: ${err.response?.data?.message || err.message}`);
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle gallery changes
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!files.every((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type))) {
      setMessage('Error: Only JPG, PNG, or GIF files are allowed.');
      return;
    }
    if (!files.every((file) => file.size <= 2 * 1024 * 1024)) {
      setMessage('Error: File size must be less than 2MB.');
      return;
    }

    setFormData((prev) => ({ ...prev, gallery: prev.gallery.concat(files) }));
    const newPreviews = files.map((file) => ({
      id: 'new-' + file.name + '-' + file.lastModified,
      url: URL.createObjectURL(file),
      existing: false,
      file: file,
    }));
    setGalleryPreviews((prev) => prev.concat(newPreviews));
  };

  // Remove image from preview
  const removePreview = (id) => {
    setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((f) => 'new-' + f.name + '-' + f.lastModified !== id),
    }));
  };

  // Add/Remove dynamic fields
  const addEducation = () => setEducations([...educations, { degree: '', college: '', year: '' }]);
  const deleteEducation = (index) => setEducations(educations.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { hospital: '', from: '', to: '', designation: '' }]);
  const addAward = () => setAwards([...awards, { award: '', year: '' }]);
  const addMembership = () => setMemberships([...memberships, '']);
  const removeSpecialization = (id) => setSpecializations(specializations.filter((specId) => specId !== id));

  const handleEducationChange = (index, field, value) => {
    if (field === 'year' && value && !/^\d{4}$/.test(value)) {
      setMessage('Error: Year must be a valid 4-digit number.');
      return;
    }
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleAwardChange = (index, field, value) => {
    const updated = [...awards];
    if (field === 'year' && value && !/^\d{4}$/.test(value)) {
      setMessage('Error: Year must be a valid 4-digit number.');
      return;
    }
    updated[index][field] = value;
    setAwards(updated);
  };

  const handleMembershipChange = (index, value) => {
    const updated = [...memberships];
    updated[index] = value;
    setMemberships(updated);
  };

  const handleRegistrationChange = (index, field, value) => {
    const updated = [...registrations];
    updated[index][field] = value;
    setRegistrations(updated);
  };

  // Save profile
  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const requiredFields = ['f_name', 'l_name', 'email'];
    if (mode === 'add') requiredFields.push('password');
    for (let field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        setMessage(`Error: ${field.replace('_', ' ')} is required.`);
        setIsLoading(false);
        return;
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage('Error: Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('prefix', formData.prefix);
      data.append('f_name', formData.f_name);
      data.append('l_name', formData.l_name);
      data.append('phone', formData.phone);
      data.append('phone_code', formData.phone_code);
      data.append('DOB', formData.DOB);
      data.append('gender', formData.gender);
      data.append('bio', formData.bio);
      data.append('address_line1', formData.address_line1);
      data.append('address_line2', formData.address_line2);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('country', formData.country);
      data.append('pin_code', formData.pin_code);
      data.append('consultation_fee_type', formData.consultation_fee_type);
      data.append('consultation_fee', formData.consultation_fee_type === 'paid' ? formData.consultation_fee : 0);
      if (mode === 'add') {
        data.append('email', formData.email);
        if (formData.password.trim()) data.append('password', formData.password);
      }
      if (getUserRole() === 'admin' && selectedClinicId) data.append('clinic_ids', JSON.stringify([parseInt(selectedClinicId)]));
      data.append('services', JSON.stringify(services));
      data.append('specializations', JSON.stringify(specializations));
      data.append(
        'educations',
        JSON.stringify(
          educations
            .map((edu) => ({
              degree: edu.degree || '',
              institution: edu.college || '',
              year_of_passing: parseInt(edu.year) || null,
            }))
            .filter((edu) => edu.degree && edu.institution)
        )
      );
      data.append(
        'experiences',
        JSON.stringify(
          experiences
            .map((exp) => ({
              hospital: exp.hospital || '',
              start_date: exp.from || '',
              end_date: exp.to || '',
              currently_working: !exp.to,
              designation: exp.designation || '',
            }))
            .filter((exp) => exp.hospital && exp.start_date)
        )
      );
      data.append(
        'awards',
        JSON.stringify(
          awards
            .map((award) => ({
              title: award.award || '',
              year: parseInt(award.year) || null,
            }))
            .filter((award) => award.title)
        )
      );
      data.append(
        'memberships',
        JSON.stringify(
          memberships
            .map((m) => ({ text: m || '' }))
            .filter((m) => m.text)
        )
      );
      if (registrations.length > 0 && registrations[0].registration) {
        data.append(
          'registration',
          JSON.stringify({
            registration_number: registrations[0].registration || '',
            registration_date: registrations[0].year || '',
          })
        );
      }

      formData.gallery.forEach((file) => data.append('gallery', file));

      const removedGallery = galleryPreviews
        .filter((preview) => preview.existing && !galleryPreviews.some((p) => p.id === preview.id))
        .map((preview) => preview.url.replace(BASE_URL, ''));
      if (removedGallery.length > 0) {
        data.append('removeGallery', JSON.stringify(removedGallery));
      }

      const url = doctorId ? `${BASE_URL}/doctor/add-or-update?doctor_id=${doctorId}` : `${BASE_URL}/doctor/add-or-update`;
      const response = await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(
        mode === 'edit'
          ? 'Doctor profile updated successfully!'
          : 'Doctor profile created successfully!'
      );
      if (onSaved) onSaved();
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || error.message || 'Failed to save profile'}`
      );
      console.error('Error details:', error.response ? error.response.data : error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 placeholder-gray-400';

  if (isLoading) {
    return (
      <div className="w-full text-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {message && (
        <div
          className={`p-4 mb-6 rounded-md flex justify-between items-center ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
          <button onClick={() => setMessage('')} className="text-lg font-bold">
            ×
          </button>
        </div>
      )}

      <form onSubmit={saveProfile} className="space-y-10">
        {/* Basic Information */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password{mode === 'add' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={mode === 'edit' ? 'Leave blank to keep current' : 'Enter password'}
                className={inputBase}
                required={mode === 'add'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="f_name"
                value={formData.f_name}
                onChange={handleInputChange}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="l_name"
                value={formData.l_name}
                onChange={handleInputChange}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={inputBase}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleInputChange}
                className={inputBase}
              />
            </div>
            {getUserRole() === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Clinic</label>
                <select
                  value={selectedClinicId || ''}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className={inputBase}
                >
                  <option value="">Select Clinic</option>
                  {availableClinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {getUserRole() === 'clinic' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Clinic</label>
                <span className="text-sm">{clinics[0]?.name || 'N/A'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Image / Gallery */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700">Profile Image</h4>
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
            <p className="text-sm text-gray-500">Drop files here to upload (JPG, PNG, GIF, max 2MB)</p>
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
                    title={img.existing ? 'Remove from preview' : 'Remove'}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biography */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700">About Me</h4>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className={inputBase}
            rows="5"
            placeholder="Enter biography"
          />
        </div>

        {/* Clinic Info */}
        {clinics.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-700">Clinic Info</h4>
            {clinics.map(
              (clinic, i) =>
                !clinic.remove && (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Clinic Name', field: 'name' },
                      { label: 'Address Line 1', field: 'address_line1' },
                      { label: 'Address Line 2', field: 'address_line2' },
                      { label: 'City', field: 'city' },
                      { label: 'State', field: 'state' },
                      { label: 'Country', field: 'country' },
                      { label: 'Postal Code', field: 'pin_code' },
                    ].map((item, j) => (
                      <div key={j}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{item.label}</label>
                        <input
                          type="text"
                          value={clinic[item.field] || ''}
                          className={inputBase}
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        )}

        {/* Contact Details */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Contact Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Address Line 1', name: 'address_line1' },
              { label: 'Address Line 2', name: 'address_line2' },
              { label: 'City', name: 'city' },
              { label: 'State / Province', name: 'state' },
              { label: 'Country', name: 'country' },
              { label: 'Postal Code', name: 'pin_code' },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{item.label}</label>
                <input
                  type="text"
                  name={item.name}
                  value={formData[item.name]}
                  onChange={handleInputChange}
                  className={inputBase}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Pricing</h4>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center">
              <input
                type="radio"
                name="consultation_fee_type"
                value="free"
                checked={formData.consultation_fee_type === 'free'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Free
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="consultation_fee_type"
                value="paid"
                checked={formData.consultation_fee_type === 'paid'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Custom Price (per hour)
            </label>
          </div>
          {formData.consultation_fee_type === 'paid' && (
            <div className="w-full md:w-1/3">
              <input
                type="number"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleInputChange}
                className={inputBase}
                placeholder="20"
              />
              <p className="text-xs text-gray-500 mt-1">Custom price you can add</p>
            </div>
          )}
        </div>

        {/* Services and Specialization */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Services and Specialization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Services</label>
            <input
              type="text"
              value={services.join(', ') || ''}
              onChange={(e) =>
                setServices(
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s)
                )
              }
              className={inputBase}
              placeholder="Enter Services"
            />
            <p className="text-xs text-gray-500 mt-1">Note: Type & Press enter to add new services</p>
            {services.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No services assigned. Add services above.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Search Specializations</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputBase}
                placeholder="Search specializations..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Specializations</label>
            <select
              multiple
              value={specializations}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
                setSpecializations([...new Set([...specializations, ...selectedIds])]);
              }}
              className={inputBase}
            >
              {Array.isArray(availableSpecializations) && availableSpecializations.length > 0 ? (
                availableSpecializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name || 'Unknown'}
                  </option>
                ))
              ) : (
                <option disabled>No specializations available</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple specializations</p>
          </div>
          {specializations.length > 0 && (
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2">Selected Specializations</h5>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Specialization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {specializations.map((specializationId) => {
                    const spec = allSpecializations.find((s) => s.id === specializationId);
                    return (
                      <tr key={specializationId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{spec ? spec.name : 'Unknown'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeSpecialization(specializationId)}
                            className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Education</h4>
          {educations.map((edu, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(i, 'degree', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">College/Institute</label>
                <input
                  type="text"
                  value={edu.college}
                  onChange={(e) => handleEducationChange(i, 'college', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Year of Completion</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(i, 'year', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => deleteEducation(i)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i>Add More
          </button>
        </div>

        {/* Experience */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Experience</h4>
          {experiences.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={exp.hospital}
                  onChange={(e) => handleExperienceChange(i, 'hospital', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={exp.from}
                  onChange={(e) => handleExperienceChange(i, 'from', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={exp.to}
                  onChange={(e) => handleExperienceChange(i, 'to', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                <input
                  type="text"
                  value={exp.designation}
                  onChange={(e) => handleExperienceChange(i, 'designation', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => setExperiences(experiences.filter((_, index) => index !== i))}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i>Add More
          </button>
        </div>

        {/* Awards */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Awards</h4>
          {awards.map((award, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-600 mb-1">Award</label>
                <input
                  type="text"
                  value={award.award}
                  onChange={(e) => handleAwardChange(i, 'award', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-600 mb-1">Year</label>
                <input
                  type="text"
                  value={award.year}
                  onChange={(e) => handleAwardChange(i, 'year', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={() => setAwards(awards.filter((_, index) => index !== i))}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAward}
            className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i>Add More
          </button>
        </div>

        {/* Memberships */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Memberships</h4>
          {memberships.map((membership, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-11">
                <label className="block text-sm font-medium text-gray-600 mb-1">Membership</label>
                <input
                  type="text"
                  value={membership}
                  onChange={(e) => handleMembershipChange(i, e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => setMemberships(memberships.filter((_, index) => index !== i))}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMembership}
            className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i>Add More
          </button>
        </div>

        {/* Registrations */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Registrations</h4>
          {registrations.slice(0, 1).map((reg, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={reg.registration}
                  onChange={(e) => handleRegistrationChange(i, 'registration', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
                <input
                  type="date"
                  value={reg.year}
                  onChange={(e) => handleRegistrationChange(i, 'year', e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-md transition disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading
              ? mode === 'edit'
                ? 'Updating...'
                : 'Creating...'
              : mode === 'edit'
              ? 'Save Changes'
              : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
}

function DoctorsManagement() {
  const [doctorData, setDoctorData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/all?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedDoctors = res.data.payload.users.map((doc) => ({
        id: doc.id,
        name: `${doc.prefix}. ${doc.f_name} ${doc.l_name}`,
        specialty:
          doc.specializations?.map((s) => s.name).join(', ') || '..........',
        avatar: doc.profile_image || 'https://via.placeholder.com/40',
        memberSince: new Date(doc.created_at).toLocaleDateString(),
        earned: `$ ${doc.earning || '0.00'}`,
        status: doc.status === '1',
      }));
      setDoctorData(formattedDoctors);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const doctor = doctorData.find((doc) => doc.id === id);
      if (!doctor) return;
      const newStatus = !doctor.status ? '1' : '2';
      await axios.put(
        `${BASE_URL}/user/change-status`,
        { id: id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctorData((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, status: !doc.status } : doc
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm('Delete this doctor?');
    if (!confirmDelete) return;
    try {
      setIsBusy(true);
      await axios.delete(`${BASE_URL}/user/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id: id },
      });
      setDoctorData((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    } finally {
      setIsBusy(false);
    }
  };

  const totalPages = Math.ceil(doctorData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentDoctors = doctorData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleAddDoctor = () => {
    setEditingDoctorId(null);
    setShowForm(true);
  };

  const handleEditDoctor = (id) => {
    setEditingDoctorId(id);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setEditingDoctorId(null);
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (showForm) {
    return (
      <AdminLayout>
        <div className="flex-1 p-6">
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h2 className="text-3xl text-gray-900 mb-2">
                {editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <p className="text-gray-600">
                Dashboard / Users / Doctor / {editingDoctorId ? 'Edit' : 'Add'}
              </p>
            </div>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={handleBackToList}
            >
              Back to List
            </button>
          </div>
          <DoctorProfileForm
            mode={editingDoctorId ? 'edit' : 'add'}
            doctorId={editingDoctorId}
            onCancel={handleBackToList}
            onSaved={handleBackToList}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 p-6">
        <div className="mb-5">
          <h2 className="text-3xl text-gray-900 mb-2">List of Doctors</h2>
          <p className="text-gray-600">Dashboard / Users / Doctor</p>
        </div>

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
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddDoctor}
              disabled={isBusy}
            >
              Add Doctor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Since
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleEditDoctor(doctor.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.memberSince}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.earned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={doctor.status}
                          onChange={() => toggleStatus(doctor.id)}
                          disabled={isBusy}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditDoctor(doctor.id)}
                        disabled={isBusy}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => deleteDoctor(doctor.id)}
                        disabled={isBusy}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentDoctors.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, doctorData.length)} of{' '}
              {doctorData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DoctorsManagement;