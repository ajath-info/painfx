import React, { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const ProfileSettings = () => {
  // Form state
  const [form, setForm] = useState({
    title: '',
    gender: '',
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    suburb: '',
    homePhone: '',
    workPhone: '',
    mobilePhone: '',
    email: '',
    doctorName: '',
    doctorAddress: '',
    doctorLetterPermission: false,
    referralSource: '',
    referralName: '',
    injuryLocation: '',
    privateHealthInsurance: '',
    veteransCardNumber: '',
    medicareEPC: false,
    claimType: '',
    employer: '',
    employerContact: '',
    employerAddress: '',
    employerPhone: '',
    occupation: '',
    dateOfInjury: '',
    insurer: '',
    claimNumber: '',
    caseManager: '',
    insurerAddress: '',
    insurerPhone: '',
    reasonForVisit: '',
    treatmentGoals: '',
    problemDuration: '',
    pastSimilarProblem: false,
    painDescription: [],
    symptoms: [],
    problemStatus: '',
    painTriggers: [],
    painInterference: [],
    workType: '',
    otherHealthProfessionals: '',
    medications: '',
    cortisoneUse: false,
    pregnancyStatus: 'NA',
    medicalConditions: [],
  });

  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (form.email && !form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Invalid email address';
    }
    if (form.mobilePhone && !form.mobilePhone.match(/^\+?\d{10,14}$/)) {
      newErrors.phone = 'Invalid mobile phone number (10-14 digits)';
    }
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.injuryLocation.trim()) newErrors.injuryLocation = 'Injury location is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (e, field) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const currentValues = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', form);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PatientLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={form.gender === 'Male'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={form.gender === 'Female'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Female
                      </label>
                </div>
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  required
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  required
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-red-500 text-sm mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.dob ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.dob ? 'true' : 'false'}
                  aria-describedBy={errors.dob ? 'dob-error' : undefined}
                  required
                />
                {errors.dob && (
                  <p id="dob-error" className="text-red-500 text-sm mt-1">
                    {errors.dob}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  required
                />
                {errors.address && (
                  <p id="address-error" className="text-red-500 text-sm mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="suburb" className="block text-sm font-medium text-gray-700 mb-2">
                  Suburb
                </label>
                <input
                  id="suburb"
                  type="text"
                  name="suburb"
                  value={form.suburb}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="homePhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Home Phone
                </label>
                <input
                  id="homePhone"
                  type="tel"
                  name="homePhone"
                  value={form.homePhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="workPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Phone
                </label>
                <input
                  id="workPhone"
                  type="tel"
                  name="workPhone"
                  value={form.workPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone
                </label>
                <input
                  id="mobilePhone"
                  type="tel"
                  name="mobilePhone"
                  value={form.mobilePhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Name
                </label>
                <input
                  id="doctorName"
                  type="text"
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Address
                </label>
                <input
                  id="doctorAddress"
                  type="text"
                  name="doctorAddress"
                  value={form.doctorAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="doctorLetterPermission"
                    checked={form.doctorLetterPermission}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Permission to send a letter to your doctor confirming treatment
                </label>
              </div>
            </div>
          </div>

          {/* Referral Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
                  How did you find out about this practice?
                </label>
                <select
                  id="referralSource"
                  name="referralSource"
                  value={form.referralSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                >
                  <option value="">Select Referral Source</option>
                  <option value="Advert/Poster">Advert/Poster</option>
                  <option value="Brochure/Flyer">Brochure/Flyer</option>
                  <option value="Yellow Pages">Yellow Pages</option>
                  <option value="Yellow Pages Online">Yellow Pages Online</option>
                  <option value="Directory Assist">Directory Assist</option>
                  <option value="Our Website">Our Website</option>
                  <option value="From My Doctor">From My Doctor</option>
                  <option value="Friend/Referral">Friend/Referral</option>
                </select>
              </div>
              {form.referralSource === 'Friend/Referral' && (
                <div>
                  <label htmlFor="referralName" className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Name
                  </label>
                  <input
                    id="referralName"
                    type="text"
                    name="referralName"
                    value={form.referralName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Injury Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Injury Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="injuryLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Injury Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="injuryLocation"
                  type="text"
                  name="injuryLocation"
                  value={form.injuryLocation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.injuryLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.injuryLocation ? 'true' : 'false'}
                  aria-describedby={errors.injuryLocation ? 'injuryLocation-error' : undefined}
                  required
                />
                {errors.injuryLocation && (
                  <p id="injuryLocation-error" className="text-red-500 text-sm mt-1">
                    {errors.injuryLocation}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Seeking Services
                </label>
                <textarea
                  id="reasonForVisit"
                  name="reasonForVisit"
                  value={form.reasonForVisit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="treatmentGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Goals
                </label>
                <textarea
                  id="treatmentGoals"
                  name="treatmentGoals"
                  value={form.treatmentGoals}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="problemDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  How long have you had this problem?
                </label>
                <input
                  id="problemDuration"
                  type="text"
                  name="problemDuration"
                  value={form.problemDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="pastSimilarProblem"
                  checked={form.pastSimilarProblem}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Had this or a similar problem in the past
                </label>
              </div>
            </div>
          </div>

          {/* Pain Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Description</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Constant', 'Comes & goes', 'Sharp', 'Dull Achy', 'Intensity varies', 'Intensity doesn\'t vary', 'Shooting', 'Radiates', 'Travels'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.painDescription.includes(option)}
                    onChange={(e) => handleMultiSelect(e, 'painDescription')}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptoms</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Pins and needles', 'Tingling', 'Numbness', 'Weakness'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.symptoms.includes(option)}
                    onChange={(e) => handleMultiSelect(e, 'symptoms')}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Problem Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Status</h3>
            <div className="flex space-x-4">
              {['About the same', 'Getting better', 'Getting worse'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="problemStatus"
                    value={option}
                    checked={form.problemStatus === option}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Pain Triggers */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Triggers</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Sitting', 'Standing up from a chair', 'Walking'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.painTriggers.includes(option)}
                    onChange={(e) => handleMultiSelect(e, 'painTriggers')}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
              <div>
                <label htmlFor="painTriggersOther" className="block text-sm font-medium text-gray-700 mb-2">
                  Other
                </label>
                <input
                  id="painTriggersOther"
                  type="text"
                  name="painTriggersOther"
                  value={form.painTriggersOther || ''}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      painTriggers: [...prev.painTriggers.filter((t) => !t.startsWith('Other:')), `Other: ${e.target.value}`],
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Pain Interference */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Interference</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Work', 'Sleep', 'Hobbies', 'Leisure'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.painInterference.includes(option)}
                    onChange={(e) => handleMultiSelect(e, 'painInterference')}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Insurance Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="privateHealthInsurance" className="block text-sm font-medium text-gray-700 mb-2">
                  Private Health Insurance (Name)
                </label>
                <input
                  id="privateHealthInsurance"
                  type="text"
                  name="privateHealthInsurance"
                  value={form.privateHealthInsurance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="veteransCardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Veterans Affairs Card Number
                </label>
                <input
                  id="veteransCardNumber"
                  type="text"
                  name="veteransCardNumber"
                  value={form.veteransCardNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="medicareEPC"
                  checked={form.medicareEPC}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Medicare EPC Plan
                </label>
              </div>
            </div>
          </div>

          {/* Claim Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Information</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="claimType"
                value="Workers Compensation or CTP"
                checked={form.claimType === 'Workers Compensation or CTP'}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  claimType: e.target.checked ? e.target.value : '',
                }))}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Claiming through Worker's Compensation or CTP
              </label>
            </div>
            {form.claimType === 'Workers Compensation or CTP' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employer" className="block text-sm font-medium text-gray-700 mb-2">
                    Employer
                  </label>
                  <input
                    id="employer"
                    type="text"
                    name="employer"
                    value={form.employer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="employerContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    id="employerContact"
                    type="text"
                    name="employerContact"
                    value={form.employerContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="employerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Employer Address
                  </label>
                  <input
                    id="employerAddress"
                    type="text"
                    name="employerAddress"
                    value={form.employerAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="employerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Employer Phone
                  </label>
                  <input
                    id="employerPhone"
                    type="tel"
                    name="employerPhone"
                    value={form.employerPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="dateOfInjury" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Injury
                  </label>
                  <input
                    id="dateOfInjury"
                    type="date"
                    name="dateOfInjury"
                    value={form.dateOfInjury}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="insurer" className="block text-sm font-medium text-gray-700 mb-2">
                    Insurer
                  </label>
                  <input
                    id="insurer"
                    type="text"
                    name="insurer"
                    value={form.insurer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="claimNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Number
                  </label>
                  <input
                    id="claimNumber"
                    type="text"
                    name="claimNumber"
                    value={form.claimNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="caseManager" className="block text-sm font-medium text-gray-700 mb-2">
                    Case Manager
                  </label>
                  <input
                    id="caseManager"
                    type="text"
                    name="caseManager"
                    value={form.caseManager}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="insurerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Insurer Address
                  </label>
                  <input
                    id="insurerAddress"
                    type="text"
                    name="insurerAddress"
                    value={form.insurerAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="insurerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Insurer Phone
                  </label>
                  <input
                    id="insurerPhone"
                    type="tel"
                    name="insurerPhone"
                    value={form.insurerPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Medical History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Work
                </label>
                <input
                  id="workType"
                  type="text"
                  name="workType"
                  value={form.workType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="otherHealthProfessionals" className="block text-sm font-medium text-gray-700 mb-2">
                  Other Health Professionals Seen
                </label>
                <textarea
                  id="otherHealthProfessionals"
                  name="otherHealthProfessionals"
                  value={form.otherHealthProfessionals}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                  Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  rows="4"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cortisoneUse"
                  checked={form.cortisoneUse}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Ever taken oral cortisone or prednisone
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Status</label>
                <div className="flex space-x-4">
                  {['Yes', 'No', 'NA'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="pregnancyStatus"
                        value={option}
                        checked={form.pregnancyStatus === option}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                <div className="grid grid-cols-2 gap-4">
                  {['High blood pressure', 'Cancer', 'Heart problems', 'Diabetes'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={form.medicalConditions.includes(option)}
                        onChange={(e) => handleMultiSelect(e, 'medicalConditions')}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </PatientLayout>
  );
};

export default ProfileSettings;