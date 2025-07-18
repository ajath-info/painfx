import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import DoctorLayout from '../../layouts/DoctorLayout';

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'http://localhost:5000';

const DoctorProfileForm = () => {
  const [services, setServices] = useState(['Tooth cleaning']);
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([{ hospital: '', from: '', to: '', designation: '' }]);
  const [awards, setAwards] = useState([{ award: '', year: '' }]);
  const [memberships, setMemberships] = useState(['']);
  const [registrations, setRegistrations] = useState([{ registration: '', year: '' }]);
  const [clinics, setClinics] = useState([]);
  const [newClinic, setNewClinic] = useState({
    name: '', address_line1: '', address_line2: '', city: '', state: '', country: '', pin_code: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    prefix: 'Dr', f_name: '', l_name: '', phone: '', phone_code: '+61',
    DOB: '', gender: 'male', bio: '', profile_image: null,
    address_line1: '', address_line2: '', city: '', state: '', country: '', pin_code: '',
    consultation_fee_type: 'free', consultation_fee: 0, username: '', email: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Helper function to format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Debounced search function for specializations
  const searchSpecializations = useCallback(
    debounce(async (query) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Authentication token not found. Please login again.');
          setAvailableSpecializations([]);
          return;
        }

        let response;
        if (!query) {
          // When query is empty, reset to all specializations
          setAvailableSpecializations(allSpecializations);
          return;
        }

        // Search specializations
        response = await axios.get(`${BASE_URL}/doctor/search-specialization?search=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Handle response structure
        const specializationsData = Array.isArray(response.data.payload)
          ? response.data.payload
          : Array.isArray(response.data)
            ? response.data
            : [];
        setAvailableSpecializations(specializationsData);
        if (process.env.NODE_ENV !== 'production') {
          console.log('Search Specializations API Response:', response.data);
          console.log('Set availableSpecializations:', specializationsData);
        }
      } catch (err) {
        console.error('Search Specializations Error:', err.response?.data || err.message);
        setMessage(`Error searching specializations: ${err.response?.data?.message || err.message}`);
        setAvailableSpecializations([]);
      }
    }, 500),
    [allSpecializations]
  );

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Authentication token not found. Please login again.');
          setIsLoading(false);
          return;
        }

        // Fetch doctor profile
        const profileRes = await axios.get(`${BASE_URL}/user/doctor-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (process.env.NODE_ENV !== 'production') {
          console.log('Profile API Response:', profileRes.data);
        }

        // Extract doctor data from payload
        const doctorData = profileRes.data.payload?.doctor || {};

        // Map profile data
        const profileData = {
          prefix: doctorData.prefix || 'Dr',
          f_name: doctorData.f_name || '',
          l_name: doctorData.l_name || '',
          phone: doctorData.phone || '',
          phone_code: doctorData.phone_code || '+61',
          DOB: formatDateForInput(doctorData.DOB),
          gender: doctorData.gender || 'male',
          bio: doctorData.bio || '',
          profile_image: null,
          address_line1: doctorData.address_line1 || '',
          address_line2: doctorData.address_line2 || '',
          city: doctorData.city || '',
          state: doctorData.state || '',
          country: doctorData.country || '',
          pin_code: doctorData.pin_code || '',
          consultation_fee_type: doctorData.consultation_fee_type || 'free',
          consultation_fee: parseFloat(doctorData.consultation_fee) || 0,
          username: doctorData.user_name || '',
          email: doctorData.email || ''
        };
        setProfile(profileData);

        // Set profile image with base URL concatenation
        if (doctorData.profile_image) {
          const imageUrl = doctorData.profile_image.startsWith('http')
            ? doctorData.profile_image
            : `${IMAGE_BASE_URL}${doctorData.profile_image.startsWith('/') ? '' : '/'}${doctorData.profile_image}`;
          setPreviewImage(imageUrl);
        }

        // Map educations data
        const educationData = profileRes.data.payload?.educations || [];
        const mappedEducations = educationData.length > 0
          ? educationData.map(edu => ({
              degree: edu.degree || '',
              college: edu.institution || '',
              year: edu.year_of_passing?.toString() || ''
            }))
          : [{ degree: '', college: '', year: '' }];
        setEducations(mappedEducations);

        // Map experiences data
        const experienceData = profileRes.data.payload?.experiences || [];
        const mappedExperiences = experienceData.length > 0
          ? experienceData.map(exp => ({
              hospital: exp.hospital || '',
              from: formatDateForInput(exp.start_date),
              to: formatDateForInput(exp.end_date),
              designation: exp.designation || ''
            }))
          : [{ hospital: '', from: '', to: '', designation: '' }];
        setExperiences(mappedExperiences);

        // Map awards data
        const awardData = profileRes.data.payload?.awards || [];
        const mappedAwards = awardData.length > 0
          ? awardData.map(award => ({
              award: award.title || '',
              year: award.year?.toString() || ''
            }))
          : [{ award: '', year: '' }];
        setAwards(mappedAwards);

        // Map memberships data
        const membershipData = profileRes.data.payload?.memberships || [];
        const mappedMemberships = membershipData.length > 0
          ? membershipData.map(membership => membership.text || '')
          : [''];
        setMemberships(mappedMemberships);

        // Map registration data
        const registrationData = profileRes.data.payload?.registration;
        const mappedRegistrations = registrationData
          ? [{
              registration: registrationData.registration_number || '',
              year: formatDateForInput(registrationData.registration_date)
            }]
          : [{ registration: '', year: '' }];
        setRegistrations(mappedRegistrations);

        // Map clinics data
        const clinicData = profileRes.data.payload?.clinics || [];
        setClinics(clinicData);

        // Map services data
        const serviceData = profileRes.data.payload?.services || [];
        const mappedServices = serviceData.length > 0
          ? serviceData.map(service => service.name || service.service_name || 'Unknown Service')
          : ['Tooth cleaning'];
        setServices(mappedServices);

        // Map specializations data
        const specializationData = profileRes.data.payload?.specializations || [];
        const mappedSpecializations = specializationData.map(spec => spec.specialization_id).filter(id => id);
        setSpecializations(mappedSpecializations);
        if (process.env.NODE_ENV !== 'production') {
          console.log('Mapped Specializations:', mappedSpecializations);
        }

        // Fetch all available specializations
        const specsRes = await axios.get(`${BASE_URL}/doctor/get-specializations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const specializationsData = Array.isArray(specsRes.data.payload)
          ? specsRes.data.payload
          : Array.isArray(specsRes.data)
            ? specsRes.data
            : [];
        setAllSpecializations(specializationsData);
        setAvailableSpecializations(specializationsData);
        if (process.env.NODE_ENV !== 'production') {
          console.log('All Specializations API Response:', specsRes.data);
          console.log('Set allSpecializations and availableSpecializations:', specializationsData);
        }

        setMessage('');
      } catch (err) {
        console.error('Fetch Error:', err.response?.data || err.message);
        setMessage(`Error fetching initial data: ${err.response?.data?.message || err.message}`);
        setAllSpecializations([]);
        setAvailableSpecializations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trigger search when query changes
  useEffect(() => {
    searchSpecializations(searchQuery);
  }, [searchQuery, searchSpecializations]);

  // Utility Functions
  const addEducation = () => setEducations([...educations, { degree: '', college: '', year: '' }]);
  const deleteEducation = (index) => setEducations(educations.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { hospital: '', from: '', to: '', designation: '' }]);
  const addAward = () => setAwards([...awards, { award: '', year: '' }]);
  const addMembership = () => setMemberships([...memberships, '']);
  const addClinic = () => {
    if (newClinic.name && newClinic.address_line1) {
      setClinics([...clinics, { ...newClinic, created_by_role: 'doctor' }]);
      setNewClinic({ name: '', address_line1: '', address_line2: '', city: '', state: '', country: '', pin_code: '' });
    } else {
      setMessage('Error: Clinic name and address line 1 are required.');
    }
  };
  const deleteClinic = (index) => {
    setClinics(clinics.map((clinic, i) => i === index ? { ...clinic, remove: true } : clinic));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    if (field === 'year' && value && !/^\d{4}$/.test(value)) {
      setMessage('Error: Year must be a valid 4-digit number.');
      return;
    }
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

  const handleClinicChange = (index, field, value) => {
    const updated = [...clinics];
    updated[index][field] = value;
    setClinics(updated);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setMessage('Error: Only JPG, PNG or GIF files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Error: File size must be less than 2MB.');
      return;
    }

    setProfile(prev => ({ ...prev, profile_image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    setIsLoading(true);
    setMessage('');

    if (!profile.f_name || !profile.l_name) {
      setMessage('Error: First Name and Last Name are required.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        setIsLoading(false);
        return;
      }

      const data = new FormData();
      if (profile.profile_image) data.append('image', profile.profile_image);

      const profileData = {
        profile: {
          ...profile,
          consultation_fee: profile.consultation_fee_type === 'paid' ? profile.consultation_fee : 0,
          profile_image: undefined // Exclude profile_image from JSON payload
        },
        services,
        specializations,
        educations: educations.map(edu => ({
          degree: edu.degree || '',
          institution: edu.college || '',
          year_of_passing: parseInt(edu.year) || null
        })).filter(edu => edu.degree && edu.institution),
        experiences: experiences.map(exp => ({
          hospital: exp.hospital || '',
          start_date: exp.from || '',
          end_date: exp.to || '',
          currently_working: !exp.to,
          designation: exp.designation || ''
        })).filter(exp => exp.hospital && exp.start_date),
        awards: awards.map(award => ({
          title: award.award || '',
          year: parseInt(award.year) || null
        })).filter(award => award.title),
        memberships: memberships.map(m => ({ text: m || '' })).filter(m => m.text),
        registration: registrations.length > 0 && registrations[0].registration ? {
          registration_number: registrations[0].registration || '',
          registration_date: registrations[0].year || ''
        } : null,
        clinics
      };

      data.append('data', JSON.stringify(profileData));

      if (process.env.NODE_ENV !== 'production') {
        for (let [key, value] of data.entries()) {
          console.log(`FormData: ${key} = ${value}`);
        }
      }

      await axios.put(`${BASE_URL}/doctor/master-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Update Profile Error:', error.response?.data || error.message);
      setMessage(`Error: ${error.response?.data?.message || error.message || 'Failed to update profile'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a selected specialization
  const removeSpecialization = (id) => {
    setSpecializations(specializations.filter(specId => specId !== id));
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-700 text-lg">Loading profile data...</p>
            </div>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="w-full">
          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} flex justify-between items-center`}>
              {message}
              <button onClick={() => setMessage('')} className="text-lg font-bold">×</button>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Basic Information</h4>
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={previewImage || "/assets/img/doctors/doctor-thumb-02.jpg"}
                  alt="User"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <i className="fas fa-upload mr-2"></i>Upload Photo
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={handleProfileImageUpload}
                      accept="image/*"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Allowed JPG, GIF or PNG. Max size of 2MB</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Username', field: 'username', disabled: true },
                { label: 'Email', field: 'email', disabled: true },
                { label: 'First Name', field: 'f_name', required: true },
                { label: 'Last Name', field: 'l_name', required: true },
                { label: 'Phone Number', field: 'phone' },
                { label: 'Gender', field: 'gender', type: 'select' },
                { label: 'Date of Birth', field: 'DOB', type: 'date' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {item.label} {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.type === 'select' ? (
                    <select
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={profile[item.field] || ''}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={item.type || 'text'}
                      value={profile[item.field] || ''}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      readOnly={item.disabled}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">About Me</h4>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Biography</label>
              <textarea
                className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                value={profile.bio || ''}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Clinic Info */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Clinic Info</h4>
            {clinics.length > 0 && clinics.map((clinic, i) => (
              !clinic.remove && (
                <div key={i} className="mb-4 border-b pb-4">
                  {clinic.created_by_role === 'doctor' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Clinic Name', field: 'name' },
                        { label: 'Address Line 1', field: 'address_line1' },
                        { label: 'Address Line 2', field: 'address_line2' },
                        { label: 'City', field: 'city' },
                        { label: 'State', field: 'state' },
                        { label: 'Country', field: 'country' },
                        { label: 'Postal Code', field: 'pin_code' }
                      ].map((item, j) => (
                        <div key={j} className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700">{item.label}</label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={clinic[item.field] || ''}
                            onChange={(e) => handleClinicChange(i, item.field, e.target.value)}
                          />
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <button
                          className="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => deleteClinic(i)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700">Clinic Name (Read-only)</label>
                      <input
                        type="text"
                        className="mt-1 p-2 border rounded-md bg-gray-100"
                        value={clinic.name || ''}
                        readOnly
                      />
                      <button
                        className="mt-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-32"
                        onClick={() => deleteClinic(i)}
                      >
                        <i className="fas fa-trash-alt mr-2"></i>Unassign
                      </button>
                    </div>
                  )}
                </div>
              )
            ))}
            <div className="mt-6">
              <h5 className="text-lg font-semibold mb-4">Add New Clinic</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Clinic Name', field: 'name' },
                  { label: 'Address Line 1', field: 'address_line1' },
                  { label: 'Address Line 2', field: 'address_line2' },
                  { label: 'City', field: 'city' },
                  { label: 'State', field: 'state' },
                  { label: 'Country', field: 'country' },
                  { label: 'Postal Code', field: 'pin_code' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">{item.label}</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={newClinic[item.field] || ''}
                      onChange={(e) => setNewClinic({ ...newClinic, [item.field]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    onClick={addClinic}
                  >
                    <i className="fas fa-plus-circle mr-2"></i>Add Clinic
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Address Line 1', field: 'address_line1' },
                { label: 'Address Line 2', field: 'address_line2' },
                { label: 'City', field: 'city' },
                { label: 'State / Province', field: 'state' },
                { label: 'Country', field: 'country' },
                { label: 'Postal Code', field: 'pin_code' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={profile[item.field] || ''}
                    onChange={(e) => handleProfileChange(item.field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Pricing</h4>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rating_option"
                  value="free"
                  checked={profile.consultation_fee_type === 'free'}
                  onChange={(e) => handleProfileChange('consultation_fee_type', e.target.value)}
                  className="mr-2"
                />
                Free
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rating_option"
                  value="paid"
                  checked={profile.consultation_fee_type === 'paid'}
                  onChange={(e) => handleProfileChange('consultation_fee_type', e.target.value)}
                  className="mr-2"
                />
                Custom Price (per hour)
              </label>
            </div>
            {profile.consultation_fee_type === 'paid' && (
              <div className="w-full md:w-1/3">
                <input
                  type="number"
                  className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={profile.consultation_fee || ''}
                  onChange={(e) => handleProfileChange('consultation_fee', parseFloat(e.target.value) || 0)}
                  placeholder="20"
                />
                <p className="text-xs text-gray-500 mt-1">Custom price you can add</p>
              </div>
            )}
          </div>

          {/* Services and Specialization */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Services and Specialization</h4>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">Services</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Services"
                value={services.join(', ') || ''}
                onChange={(e) => setServices(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              />
              <p className="text-xs text-gray-500 mt-1">Note: Type & Press enter to add new services</p>
              {services.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No services assigned. Add services above.</p>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">Search Specializations</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
                  placeholder="Search specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Type to search for specializations</p>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">Select Specializations</label>
              <select
                multiple
                className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={specializations}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  setSpecializations([...new Set([...specializations, ...selectedIds])]); // Avoid duplicates
                }}
              >
                {Array.isArray(availableSpecializations) && availableSpecializations.length > 0 ? (
                  availableSpecializations.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name || 'Unknown'}</option>
                  ))
                ) : (
                  <option disabled>No specializations available</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple specializations</p>
            </div>
            {Array.isArray(allSpecializations) && specializations.length > 0 && (
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
                    {specializations.map(specializationId => {
                      const spec = allSpecializations.find(s => s.id === specializationId);
                      return (
                        <tr key={specializationId} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{spec ? spec.name : 'Unknown'}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                              onClick={() => removeSpecialization(specializationId)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {specializations.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No specializations selected. Choose from the list above.</p>
            )}
            {!Array.isArray(allSpecializations) && (
              <p className="text-sm text-red-500 mt-2">Failed to load specializations. Please try again.</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Education</h4>
            <div className="space-y-4">
              {educations.length === 0 ? (
                <button
                  className="text-blue-500 hover:text-blue-600 flex items-center"
                  onClick={addEducation}
                >
                  <i className="fas fa-plus-circle mr-2"></i>Add Education
                </button>
              ) : (
                educations.map((edu, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 flex flex-col">
                      <label className="text-sm font-medium text-gray-700">Degree</label>
                      <input
                        type="text"
                        className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(i, 'degree', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4 flex flex-col">
                      <label className="text-sm font-medium text-gray-700">College/Institute</label>
                      <input
                        type="text"
                        className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={edu.college || ''}
                        onChange={(e) => handleEducationChange(i, 'college', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3 flex flex-col">
                      <label className="text-sm font-medium text-gray-700">Year of Completion</label>
                      <input
                        type="text"
                        className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={edu.year || ''}
                        onChange={(e) => handleEducationChange(i, 'year', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <button
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => deleteEducation(i)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center"
              onClick={addEducation}
            >
              <i className="fas fa-plus-circle mr-2"></i>Add More
            </button>
          </div>

          {/* Experience */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Experience</h4>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Hospital Name</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.hospital || ''}
                      onChange={(e) => handleExperienceChange(i, 'hospital', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.from || ''}
                      onChange={(e) => handleExperienceChange(i, 'from', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">To</label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.to || ''}
                      onChange={(e) => handleExperienceChange(i, 'to', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Designation</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.designation || ''}
                      onChange={(e) => handleExperienceChange(i, 'designation', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => setExperiences(experiences.filter((_, index) => index !== i))}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center"
              onClick={addExperience}
            >
              <i className="fas fa-plus-circle mr-2"></i>Add More
            </button>
          </div>

          {/* Awards */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Awards</h4>
            <div className="space-y-4">
              {awards.map((award, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Award</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={award.award || ''}
                      onChange={(e) => handleAwardChange(i, 'award', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-5 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={award.year || ''}
                      onChange={(e) => handleAwardChange(i, 'year', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => setAwards(awards.filter((_, index) => index !== i))}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center"
              onClick={addAward}
            >
              <i className="fas fa-plus-circle mr-2"></i>Add More
            </button>
          </div>

          {/* Memberships */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Memberships</h4>
            <div className="space-y-4">
              {memberships.map((membership, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-11 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Membership</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={membership || ''}
                      onChange={(e) => handleMembershipChange(i, e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => setMemberships(memberships.filter((_, index) => index !== i))}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center"
              onClick={addMembership}
            >
              <i className="fas fa-plus-circle mr-2"></i>Add More
            </button>
          </div>

          {/* Registrations */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Registrations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registrations.slice(0, 1).map((reg, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Registration Number</label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reg.registration || ''}
                      onChange={(e) => handleRegistrationChange(i, 'registration', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Registration Date</label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reg.year || ''}
                      onChange={(e) => handleRegistrationChange(i, 'year', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              onClick={updateProfile}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfileForm;