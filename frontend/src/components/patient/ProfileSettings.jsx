import React, { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const ProfileSettings = () => {
  // Form state
  const [form, setForm] = useState({
    firstName: 'Richard',
    lastName: 'Wilson',
    dob: '1983-07-24',
    bloodGroup: 'A-',
    email: 'richard@example.com',
    phone: '+12025550125',
    address: '806 Twin Willow Lane',
    city: 'Old Forge',
    state: 'New York',
    zipCode: '13420',
    country: 'United States',
  });

  // Sidebar state management
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
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.phone.match(/^\+?\d{10,14}$/)) {
      newErrors.phone = 'Invalid phone number (10-14 digits)';
    }
    if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.zipCode.match(/^\d{5}(-\d{4})?$/)) {
      newErrors.zipCode = 'Invalid ZIP code';
    }
    if (!form.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', form);
      // Replace alert with better UI feedback (e.g., toast notification)
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
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Date of Birth */}
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
                  aria-describedby={errors.dob ? 'dob-error' : undefined}
                  required
                />
                {errors.dob && (
                  <p id="dob-error" className="text-red-500 text-sm mt-1">
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.bloodGroup ? 'true' : 'false'}
                  aria-describedby={errors.bloodGroup ? 'bloodGroup-error' : undefined}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodGroup && (
                  <p id="bloodGroup-error" className="text-red-500 text-sm mt-1">
                    {errors.bloodGroup}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  required
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              {/* Address */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={errors.city ? 'true' : 'false'}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    required
                  />
                  {errors.city && (
                    <p id="city-error" className="text-red-500 text-sm mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={errors.state ? 'true' : 'false'}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                    required
                  />
                  {errors.state && (
                    <p id="state-error" className="text-red-500 text-sm mt-1">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Zip Code */}
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={errors.zipCode ? 'true' : 'false'}
                    aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                    required
                  />
                  {errors.zipCode && (
                    <p id="zipCode-error" className="text-red-500 text-sm mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={errors.country ? 'true' : 'false'}
                    aria-describedby={errors.country ? 'country-error' : undefined}
                    required
                  />
                  {errors.country && (
                    <p id="country-error" className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
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