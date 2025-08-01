import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../common/Loader";
import { Edit, Trash2, ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import BASE_URL from "../../config";
const IMAGE_BASE_URL = 'http://localhost:5000';

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
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [educations, setEducations] = useState([{ degree: '', institution: '', year: '' }]);
  const [experiences, setExperiences] = useState([{ hospital: '', from: '', to: '', designation: '' }]);
  const [awards, setAwards] = useState([{ award: '', year: '' }]);
  const [memberships, setMemberships] = useState(['']);
  const [registrations, setRegistrations] = useState([{ registration: '', year: '' }]);
  const [clinics, setClinics] = useState([]);
  const [availableClinics, setAvailableClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const getUserRole = () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.role;
    } catch (e) {
      return null;
    }
  };
    const getUserId = () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id;
    } catch (e) {
      return null;
    }
  };

  const searchSpecializations = useCallback(
    debounce(async (query) => {
      try {
        if (!token) {
          setMessage('Authentication token not found. Please login again.');
          setAvailableSpecializations([]);
          return;
        }
        if (!query.trim()) {
          setAvailableSpecializations(allSpecializations);
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/doctor/search-specialization?search=${encodeURIComponent(query.trim())}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const specializationsData = Array.isArray(response.data.payload)
          ? response.data.payload
          : Array.isArray(response.data)
          ? response.data
          : [];
        setAvailableSpecializations(specializationsData);
        setAllSpecializations((prev) => {
          const existingIds = new Set(prev.map((spec) => spec.id));
          const newSpecializations = specializationsData.filter(
            (spec) => !existingIds.has(spec.id)
          );
          return [...prev, ...newSpecializations];
        });
      } catch (err) {
        setMessage(`Error searching specializations: ${err.response?.data?.message || err.message}`);
        setAvailableSpecializations([]);
      }
    }, 1000),
    [allSpecializations]
  );

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
          const clinicRes = await axios.get(`${BASE_URL}/clinic/get/${getUserId()}`, {
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
        DOB: data.DOB ? new Date(data.DOB).toISOString().split('T')[0] : '',
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
        url: url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`,
        existing: true,
      }));
      setGalleryPreviews(previews);

      if (Array.isArray(res.data.payload.services) && res.data.payload.services.length) {
        const serviceNames = res.data.payload.services.map(service => service.name || '');
        const validServices = serviceNames.filter(name => 
          name && 
          name.length > 1 && 
          !['[', ']', '"', ',', '\\', 'n', 't', 'r', 'a'].includes(name) &&
          !name.match(/^[\\"\[\],\s]+$/)
        );
        setServices(validServices);
      }
      if (Array.isArray(res.data.payload.specializations)) {
        const specializationIds = res.data.payload.specializations
          .map((s) => s.specialization_id)
          .filter((id) => id);
        setSpecializations(specializationIds);
        const profileSpecializations = res.data.payload.specializations.map((spec) => ({
          id: spec.specialization_id,
          name: spec.name,
        }));
        setAllSpecializations((prev) => {
          const existingIds = new Set(prev.map((spec) => spec.id));
          const newSpecializations = profileSpecializations.filter(
            (spec) => !existingIds.has(spec.id)
          );
          return [...prev, ...newSpecializations];
        });
        setAvailableSpecializations((prev) => {
          const existingIds = new Set(prev.map((spec) => spec.id));
          const newSpecializations = profileSpecializations.filter(
            (spec) => !existingIds.has(spec.id)
          );
          return [...prev, ...newSpecializations];
        });
      }
      if (Array.isArray(res.data.payload.educations) && res.data.payload.educations.length) {
        setEducations(
          res.data.payload.educations.map((e) => ({
            degree: e.degree || '',
            institution: e.institution || '',
            year: e.year_of_passing ? String(e.year_of_passing) : '',
          }))
        );
      }
      if (Array.isArray(res.data.payload.experiences) && res.data.payload.experiences.length) {
        setExperiences(
          res.data.payload.experiences.map((x) => ({
            hospital: x.hospital || '',
            from: x.start_date ? new Date(x.start_date).toISOString().split('T')[0] : '',
            to: x.end_date ? new Date(x.end_date).toISOString().split('T')[0] : '',
            designation: x.designation || '',
          }))
        );
      }
      if (Array.isArray(res.data.payload.awards) && res.data.payload.awards.length) {
        setAwards(
          res.data.payload.awards.map((a) => ({
            award: a.title || '',
            year: a.year ? String(a.year) : '',
          }))
        );
      }
      if (Array.isArray(res.data.payload.memberships) && res.data.payload.memberships.length) {
        setMemberships(res.data.payload.memberships.map((m) => m.text || ''));
      }
      if (res.data.payload.registration) {
        setRegistrations([{ 
          registration: res.data.payload.registration.registration_number, 
          year: res.data.payload.registration.registration_date ? new Date(res.data.payload.registration.registration_date).toISOString().split('T')[0] : '' 
        }]);
      }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const removePreview = (id) => {
    setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((f) => 'new-' + f.name + '-' + f.lastModified !== id),
    }));
  };

  const addEducation = () => setEducations([...educations, { degree: '', institution: '', year: '' }]);
  const deleteEducation = (index) => setEducations(educations.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { hospital: '', from: '', to: '', designation: '' }]);
  const addAward = () => setAwards([...awards, { award: '', year: '' }]);
  const addMembership = () => setMemberships([...memberships, '']);
  const removeSpecialization = (id) => setSpecializations(specializations.filter((specId) => specId !== id));
  const removeService = (index) => setServices(services.filter((_, i) => i !== index));

  const handleEducationChange = (index, field, value) => {
    if (field === 'year' && value && !/^\d{4}$/.test(value)) {
      setMessage('Error: Year must be a valid 4-digit number (e.g., 2025).');
      return;
    }
    setMessage('');
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
    if (field === 'year' && value && !/^\d{4}$/.test(value)) {
      setMessage('Error: Year must be a valid 4-digit number (e.g., 2025).');
      return;
    }
    setMessage('');
    const updated = [...awards];
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

  const handleServiceInputKeyPress = (e) => {
    if (e.key === 'Enter' && newService?.trim()) {
      e.preventDefault();
      setServices([...services, newService?.trim()]);
      setNewService('');
    }
  };

  const handleSpecializationSelect = (id) => {
    if (!specializations.includes(id)) {
      setSpecializations([...specializations, id]);
    }
    setSearchQuery('');
    setAvailableSpecializations(allSpecializations);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.f_name?.trim()) errors.push('First Name is required.');
    if (!formData.l_name?.trim()) errors.push('Last Name is required.');
    if (!formData.DOB) {
      errors.push('Date of Birth is required.');
    } else {
      const dob = new Date(formData.DOB);
      const minAgeDate = new Date('2005-07-30');
      if (dob > minAgeDate) {
        errors.push('You must be at least 20 years old.');
      }
    }
    if (!formData.gender) errors.push('Gender is required.');
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      errors.push('Phone number is invalid (must be 7-15 digits).');
    }
    if (formData.consultation_fee_type === 'paid') {
      if (
        !formData.consultation_fee ||
        isNaN(formData.consultation_fee) ||
        formData.consultation_fee < 0 ||
        !Number.isInteger(Number(formData.consultation_fee))
      ) {
        errors.push('Consultation fee must be a non-negative integer.');
      }
    }
    if (services.length === 0) {
      errors.push('At least one service is required.');
    } else {
      const uniqueServices = new Set(services.map((s) => s.toLowerCase()?.trim()));
      if (uniqueServices.size !== services.length) {
        errors.push('Duplicate services are not allowed.');
      }
      if (services.some((s) => !s?.trim())) {
        errors.push('Services cannot be empty.');
      }
    }
    if (specializations.length === 0) {
      errors.push('At least one specialization is required.');
    } else if (
      !specializations.every((id) => allSpecializations.some((spec) => spec.id === id))
    ) {
      errors.push('One or more selected specializations are invalid.');
    }
    if (
      educations.length === 0 ||
      educations.every(
        (edu) => !edu.degree?.trim() && !edu.institution?.trim() && !edu.year
      )
    ) {
      errors.push('At least one valid education entry is required.');
    } else {
      educations.forEach((edu, i) => {
        if (edu.degree?.trim() || edu.institution?.trim() || edu.year) {
          if (!edu.degree?.trim()) errors.push(`Education ${i + 1}: Degree is required.`);
          if (!edu.institution?.trim()) errors.push(`Education ${i + 1}: Institution is required.`);
          if (!edu.year) {
            errors.push(`Education ${i + 1}: Year of completion is required.`);
          } else if (edu.year < 1900 || edu.year > 2025) {
            errors.push(`Education ${i + 1}: Year must be between 1900 and 2025.`);
          }
        }
      });
    }
    if (
      experiences.length === 0 ||
      experiences.every(
        (exp) => !exp.hospital?.trim() && !exp.from && !exp.designation?.trim()
      )
    ) {
      errors.push('At least one valid experience entry is required.');
    } else {
      const today = new Date('2025-07-30');
      experiences.forEach((exp, i) => {
        if (exp.hospital?.trim() || exp.from || exp.to || exp.designation?.trim()) {
          if (!exp.hospital?.trim()) errors.push(`Experience ${i + 1}: Hospital name is required.`);
          if (!exp.from) errors.push(`Experience ${i + 1}: Start date is required.`);
          if (!exp.designation?.trim()) errors.push(`Experience ${i + 1}: Designation is required.`);
          if (exp.from) {
            const startDate = new Date(exp.from);
            if (startDate > today) {
              errors.push(`Experience ${i + 1}: Start date cannot be in the future.`);
            }
          }
          if (!exp.currently_working && !exp.to) {
            errors.push(`Experience ${i + 1}: End date is required unless currently working.`);
          }
          if (!exp.currently_working && exp.to) {
            const endDate = new Date(exp.to);
            if (endDate > today) {
              errors.push(`Experience ${i + 1}: End date cannot be in the future.`);
            }
            if (exp.from && endDate <= new Date(exp.from)) {
              errors.push(`Experience ${i + 1}: End date must be after start date.`);
            }
          }
        }
      });
    }
    awards.forEach((award, i) => {
      if (award.award?.trim() || award.year) {
        if (!award.award?.trim()) errors.push(`Award ${i + 1}: Title is required.`);
        if (!award.year) {
          errors.push(`Award ${i + 1}: Year is required.`);
        } else if (award.year < 1900 || award.year > 2025) {
          errors.push(`Award ${i + 1}: Year must be between 1900 and 2025.`);
        }
      }
    });
    memberships.forEach((membership, i) => {
      if (membership?.trim() === '') {
        errors.push(`Membership ${i + 1}: Cannot be empty if provided.`);
      }
    });
    if (
      registrations[0].registration?.trim() ||
      registrations[0].year
    ) {
      if (!registrations[0].registration?.trim()) {
        errors.push('Registration: Registration number is required if date is provided.');
      }
      if (!registrations[0].year) {
        errors.push('Registration: Registration date is required if number is provided.');
      } else {
        const regDate = new Date(registrations[0].year);
        if (regDate > new Date('2025-07-30')) {
          errors.push('Registration: Registration date cannot be in the future.');
        }
      }
    }
    if (formData.gallery.length > 0) {
      if (!formData.gallery.every((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type))) {
        errors.push('Profile image must be JPG, PNG, or GIF.');
      }
      if (formData.gallery.some((file) => file.size > 2 * 1024 * 1024)) {
        errors.push('Profile image size must be less than 2MB.');
      }
    }
    return errors;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage(errors.join('\n'));
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
      data.append('prefix', formData.prefix);
      data.append('f_name', formData.f_name.trim());
      data.append('l_name', formData.l_name.trim());
      data.append('phone', formData.phone);
      data.append('phone_code', formData.phone_code);
      data.append('DOB', formData.DOB);
      data.append('gender', formData.gender);
      data.append('bio', formData.bio.trim());
      data.append('address_line1', formData.address_line1.trim());
      data.append('address_line2', formData.address_line2.trim());
      data.append('city', formData.city.trim());
      data.append('state', formData.state.trim());
      data.append('country', formData.country.trim());
      data.append('pin_code', formData.pin_code.trim());
      data.append('consultation_fee_type', formData.consultation_fee_type);
      data.append('consultation_fee', formData.consultation_fee_type === 'paid' ? parseInt(formData.consultation_fee) : 0);

      if (mode === 'add') {
        if (!formData.email || !formData.password) {
          setMessage('Error: Email and password are required for adding a doctor.');
          setIsLoading(false);
          return;
        }
        data.append('email', formData.email.trim());
        data.append('password', formData.password.trim());
      }

      if (getUserRole() === 'admin' && selectedClinicId) {
        data.append('clinic_ids', JSON.stringify([parseInt(selectedClinicId)]));
      }

      const cleanServices = services.filter(service => 
        service && 
        service.trim().length > 1 && 
        !['[', ']', '"', ',', '\\', 'n', 't', 'r', 'a'].includes(service.trim()) &&
        !service.trim().match(/^[\\"\[\],\s]+$/)
      );
      data.append('services', JSON.stringify(cleanServices));
      data.append('specializations', JSON.stringify(specializations));
      const currentYear = new Date().getFullYear();
      const validEducations = educations
        .map((edu) => ({
          degree: edu.degree?.trim() || '',
          institution: edu.institution?.trim() || '',
          year_of_passing: parseInt(edu.year) || null,
        }))
        .filter((edu) => edu.degree && edu.institution && edu.year_of_passing >= 1900 && edu.year_of_passing <= currentYear);
      if (validEducations.length === 0 && educations.some(edu => edu.degree || edu.institution || edu.year)) {
        setMessage('Error: All education entries must have valid degree, institution, and year (1900-current).');
        setIsLoading(false);
        return;
      }
      data.append('educations', JSON.stringify(validEducations));
      const validExperiences = experiences
        .map((exp) => ({
          hospital: exp.hospital?.trim() || '',
          start_date: exp.from || '',
          end_date: exp.to || null,
          currently_working: exp.to ? false : true,
          designation: exp.designation?.trim() || '',
        }))
        .filter((exp) => exp.hospital && exp.start_date);
      data.append('experiences', JSON.stringify(validExperiences));
      const validAwards = awards
        .map((award) => ({
          title: award.award?.trim() || '',
          year: parseInt(award.year) || null,
        }))
        .filter((award) => award.title && award.year >= 1900 && award.year <= currentYear);
      if (validAwards.length === 0 && awards.some(award => award.award || award.year)) {
        setMessage('Error: All award entries must have valid title and year (1900-current).');
        setIsLoading(false);
        return;
      }
      data.append('awards', JSON.stringify(validAwards));
      data.append(
        'memberships',
        JSON.stringify(
          memberships
            .map((m) => ({ text: m?.trim() || '' }))
            .filter((m) => m.text)
        )
      );
      if (registrations.length > 0 && registrations[0].registration) {
        const regDate = new Date(registrations[0].year);
        if (regDate > new Date()) {
          setMessage('Error: Registration date cannot be in the future.');
          setIsLoading(false);
          return;
        }
        data.append(
          'registration',
          JSON.stringify({
            registration_number: registrations[0].registration?.trim() || '',
            registration_date: registrations[0].year || '',
          })
        );
      }
      if (formData.gallery.length > 0) {
        data.append('image', formData.gallery[0]);
      }
      const removedGallery = galleryPreviews
        .filter((preview) => preview.existing && !galleryPreviews.some((p) => p.id === preview.id))
        .map((preview) => preview.url.replace(BASE_URL, ''));
      if (removedGallery.length > 0) {
        data.append('removeGallery', JSON.stringify(removedGallery));
      }

      const url = mode === 'edit' ? `${BASE_URL}/doctor/add-or-update?doctor_id=${doctorId}` : `${BASE_URL}/doctor/add-or-update`;
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

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

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700">Services and Specialization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Services</label>
            <input
              type="text"
              className={inputBase}
              placeholder="Enter a service and press Enter"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={handleServiceInputKeyPress}
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add new services</p>
            {services.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No services assigned. Add services above.</p>
            )}
            {services.length > 0 && (
              <div className="mt-2">
                {services.map((service, index) => (
                  <span key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 mr-2 mb-2">
                    {service}
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => removeService(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Search Specializations <span className="text-red-500">*</span>
            </label>
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
                  onClick={() => {
                    setSearchQuery('');
                    setAvailableSpecializations(allSpecializations);
                  }}
                  className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Type to search for specializations</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Specializations <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                multiple
                className={inputBase + " h-32"}
                size="5"
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  if (selectedId) {
                    handleSpecializationSelect(selectedId);
                  }
                }}
              >
                {Array.isArray(availableSpecializations) && availableSpecializations.length > 0 ? (
                  availableSpecializations.map((spec) => (
                    <option
                      key={spec.id}
                      value={spec.id}
                      className={specializations.includes(spec.id) ? "bg-blue-100" : ""}
                    >
                      {spec.name || "Unknown Specialization"}
                    </option>
                  ))
                ) : (
                  <option disabled>No specializations available</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Click to select specializations (hold Ctrl/Cmd for multiple)</p>
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
                    {specializations.map((specializationId) => {
                      const spec = allSpecializations.find((s) => s.id === specializationId) || { name: 'Unknown Specialization' };
                      return (
                        <tr key={specializationId} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{spec.name}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                              onClick={() => removeSpecialization(specializationId)}
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
            {specializations.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No specializations selected. Choose from the list above.</p>
            )}
            {!Array.isArray(allSpecializations) && (
              <p className="text-sm text-red-500 mt-2">Failed to load specializations. Please try again.</p>
            )}
          </div>
        </div>

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
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(i, 'institution', e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Year of Completion</label>
                <input
                  type="number"
                  pattern="\d{4}"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(i, 'year', e.target.value)}
                  className={inputBase}
                  placeholder="YYYY"
                  min="1900"
                  max="2099"
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
            className="text-cyan-500 hover:text-cyan-600 flex items-center text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i>Add More
          </button>
        </div>

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
                  type="number"
                  pattern="\d{4}"
                  value={award.year}
                  onChange={(e) => handleAwardChange(i, 'year', e.target.value)}
                  className={inputBase}
                  placeholder="YYYY"
                  min="1900"
                  max="2099"
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

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-cyan-500 border border-cyan-500 cursor-pointer hover:bg-cyan-600 hover:text-white transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-2 rounded-lg text-sm font-medium text-white bg-cyan-500 cursor-pointer hover:shadow-md transition disabled:bg-gray-400"
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
          doc.specializations.length > 0 ? doc.specializations[0].name : 'Not Available',
        avatar: doc.profile_image || 'https://via.placeholder.com/40',
        memberSince: new Date(doc.created_at).toLocaleDateString(),
        earned: `AUD ${doc.earning || '0.00'}`,
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

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('User data not found in local storage.');
        return;
      }

      let user;
      try {
        user = JSON.parse(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        return;
      }

      const userRole = user.role;
      const newStatus = !doctor.status ? '1' : '2';

      if (userRole === 'admin') {
        await axios.put(
          `${BASE_URL}/user/change-status`,
          { id: id, status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (userRole === 'clinic') {
        const clinicId = user.id;
        if (!clinicId) {
          console.error('Clinic ID not found in user data.');
          return;
        }

        await axios.put(
          `${BASE_URL}/clinic/toggle-doctors-in-clinic`,
          {
            doctor_id: id.toString(),
            clinic_id: clinicId.toString(),
            status: newStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.error('Invalid user role:', userRole);
        return;
      }

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

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              currentPage === page
                ? "bg-cyan-500 text-white"
                : "border border-cyan-500 text-cyan-500 hover:bg-cyan-600 hover:text-white"
            } transition-colors duration-200`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
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
              className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-cyan-500 rounded text-xs sm:text-sm text-cyan-500 hover:bg-cyan-600 hover:text-white hover:bg-cyan-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              className="bg-cyan-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors duration-200 text-sm font-medium"
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
                {doctorData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleEditDoctor(doctor.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={`${IMAGE_BASE_URL}${doctor.avatar}`}
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
                        className="cursor-pointer px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                        onClick={() => handleEditDoctor(doctor.id)}
                        disabled={isBusy}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {doctorData.length === 0 && (
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

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, doctorData.length)} of{" "}
              {doctorData.length} entries
            </div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DoctorsManagement;