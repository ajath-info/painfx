import React, { useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';

const BASE_URL = 'https://painfx-2.onrender.com/api';

const DoctorProfileForm = () => {
  const [services, setServices] = useState(['Tooth cleaning']);
  const [specializations, setSpecializations] = useState([4, 5]);
  const [educations, setEducations] = useState([{ degree: '', college: '', year: '' }]);
  const [experiences, setExperiences] = useState([{ hospital: '', from: '', to: '', designation: '' }]);
  const [awards, setAwards] = useState([{ award: '', year: '' }]);
  const [memberships, setMemberships] = useState(['']);
  const [registrations, setRegistrations] = useState([{ registration: '', year: '' }]);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState({
    prefix: 'Dr',
    f_name: '',
    l_name: '',
    phone: '',
    phone_code: '+61',
    DOB: '',
    gender: 'male',
    bio: '',
    profile_image: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
    consultation_fee_type: 'free',
    consultation_fee: 0
  });

  // Utility Functions
  const addEducation = () => setEducations([...educations, { degree: '', college: '', year: '' }]);
  const addExperience = () => setExperiences([...experiences, { hospital: '', from: '', to: '', designation: '' }]);
  const addAward = () => setAwards([...awards, { award: '', year: '' }]);
  const addMembership = () => setMemberships([...memberships, '']);
  const addRegistration = () => setRegistrations([...registrations, { registration: '', year: '' }]);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (index, field, value) => {
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

  // ✅ Upload Profile Image
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return setMessage('Error: Only JPG, PNG or GIF files are allowed.');
    }

    if (file.size > 2 * 1024 * 1024) {
      return setMessage('Error: File size must be less than 2MB.');
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/doctor/upload-profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(prev => ({ ...prev, profile_image: response.data.imageUrl }));
      setMessage('Profile image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error uploading image. Please try again.');
    }
  };

  // ✅ Submit Profile Form
  const updateProfile = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        setIsLoading(false);
        return;
      }

      const payload = {
        profile: {
          ...profile,
          consultation_fee: profile.consultation_fee_type === 'paid' ? profile.consultation_fee : 0
        },
        services,
        specializations,
        educations: educations.map(edu => ({
          degree: edu.degree,
          institution: edu.college,
          year_of_passing: parseInt(edu.year) || null
        })).filter(edu => edu.degree && edu.institution),
        experiences: experiences.map(exp => ({
          hospital: exp.hospital,
          start_date: exp.from,
          end_date: exp.to,
          currently_working: !exp.to,
          designation: exp.designation
        })).filter(exp => exp.hospital && exp.start_date),
        awards: awards.map(award => ({
          title: award.award,
          year: parseInt(award.year) || null
        })).filter(award => award.title),
        memberships: memberships.map(m => ({ text: m })).filter(m => m.text),
        registration: registrations.length > 0 && registrations[0].registration ? {
          registration_number: registrations[0].registration,
          registration_date: registrations[0].year
        } : null,
        clinics
      };

      const response = await axios.put(`${BASE_URL}/doctor/master-update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to update profile';
      setMessage(`Error: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DoctorLayout>
 <div className="min-h-screen bg-gray-100">
      <div className="max-w-8xl mx-auto p-4 space-y-8">
        
        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="gap-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-36 h-36 border-4 border-blue-100 shadow-md object-cover mb-8" />
              <div className="flex flex-col items-start">
                <button className="items-center justify-center flex gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition duration-300">
                  Upload Photo
                </button>
                <p className="text-lg text-gray-500 mt-2 max-w-xs mb-4">
                  Allowed JPG, GIF, PNG. Max size 2MB
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Username *', field: 'username', disabled: true },
                { label: 'Email *', field: 'email', disabled: true },
                { label: 'First Name *', field: 'f_name' },
                { label: 'Last Name *', field: 'l_name' },
                { label: 'Phone Number', field: 'phone' },
                { label: 'Gender', field: 'gender', type: 'select' },
                { label: 'Date of Birth', field: 'DOB', type: 'date' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-xl font-semibold text-gray-700 mb-1">{item.label}</label>
                  {item.type === 'select' ? (
                    <select 
                      className="border rounded-lg p-3 w-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile[item.field]}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <input
                      type={item.type || 'text'}
                      value={profile[item.field] || ''}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                      placeholder={item.label.replace(' *', '')}
                      disabled={item.disabled}
                      className={`border rounded-lg p-3 w-full text-sm ${item.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">About Me</h2>
          <div className="border-gray-300 rounded-lg p-4 bg-white">
            <label htmlFor="biography" className="block text-lg font-semibold text-gray-600 mb-1">Biography</label>
            <textarea 
              id="biography" 
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="w-full h-32 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 p-2 resize-none"
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Contact Details</h2>
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
                <label className="text-xl font-semibold text-gray-700 mb-1">{item.label}</label>
                <input 
                  type="text" 
                  value={profile[item.field] || ''}
                  onChange={(e) => handleProfileChange(item.field, e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Pricing</h2>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-lg">
              <input 
                type="radio" 
                name="pricing" 
                value="free"
                checked={profile.consultation_fee_type === 'free'}
                onChange={(e) => handleProfileChange('consultation_fee_type', e.target.value)}
              /> Free
            </label>
            <label className="flex items-center gap-2 text-lg">
              <input 
                type="radio" 
                name="pricing" 
                value="paid"
                checked={profile.consultation_fee_type === 'paid'}
                onChange={(e) => handleProfileChange('consultation_fee_type', e.target.value)}
              /> Custom Price (per hour)
            </label>
            {profile.consultation_fee_type === 'paid' && (
              <input
                type="number"
                placeholder="Enter amount"
                value={profile.consultation_fee}
                onChange={(e) => handleProfileChange('consultation_fee', parseFloat(e.target.value) || 0)}
                className="border rounded-lg p-2 ml-4 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Education</h2>
          {educations.map((edu, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Degree</label>
                <input 
                  type="text" 
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(i, 'degree', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">College/Institute</label>
                <input 
                  type="text" 
                  value={edu.college}
                  onChange={(e) => handleEducationChange(i, 'college', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Year of Completion</label>
                <input 
                  type="text" 
                  value={edu.year}
                  onChange={(e) => handleEducationChange(i, 'year', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          ))}
          <button onClick={addEducation} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Experience</h2>
          {experiences.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Hospital Name</label>
                <input 
                  type="text" 
                  value={exp.hospital}
                  onChange={(e) => handleExperienceChange(i, 'hospital', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">From</label>
                <input 
                  type="date" 
                  value={exp.from}
                  onChange={(e) => handleExperienceChange(i, 'from', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">To</label>
                <input 
                  type="date" 
                  value={exp.to}
                  onChange={(e) => handleExperienceChange(i, 'to', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Designation</label>
                <input 
                  type="text" 
                  value={exp.designation}
                  onChange={(e) => handleExperienceChange(i, 'designation', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          ))}
          <button onClick={addExperience} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Awards</h2>
          {awards.map((award, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Awards</label>
                <input 
                  type="text" 
                  value={award.award}
                  onChange={(e) => handleAwardChange(i, 'award', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Year</label>
                <input 
                  type="text" 
                  value={award.year}
                  onChange={(e) => handleAwardChange(i, 'year', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          ))}
          <button onClick={addAward} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Memberships</h2>
          {memberships.map((membership, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 mb-2">
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Memberships</label>
                <input 
                  type="text" 
                  value={membership}
                  onChange={(e) => handleMembershipChange(i, e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          ))}
          <button onClick={addMembership} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Registrations</h2>
          {registrations.map((reg, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Registration</label>
                <input 
                  type="text" 
                  value={reg.registration}
                  onChange={(e) => handleRegistrationChange(i, 'registration', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-semibold text-gray-700 mb-1">Year</label>
                <input 
                  type="date" 
                  value={reg.year}
                  onChange={(e) => handleRegistrationChange(i, 'year', e.target.value)}
                  className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          ))}
          <button onClick={addRegistration} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
        </div>

        {/* Save Button */}
        <div className="bg-white p-6 rounded shadow">
          <button 
            onClick={updateProfile}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </div>
         </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfileForm;