import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import Base_url from "../../config";

// Placeholder for icons (replace with actual icon components, e.g., from react-icons)
const Check = () => <span></span>;
const Mail = () => <span></span>;
const MapPin = () => <span></span>;
const Calendar = () => <span></span>;
const Edit3 = () => <span></span>;
const User = () => <span></span>;
const Lock = () => <span></span>;
const Save = () => <span></span>;
const X = () => <span></span>;
const Eye = () => <span></span>;
const EyeOff = () => <span></span>;
const AlertCircle = () => <span></span>;

// Format date utility
const formatDate = (dateString) => {
  if (!dateString) return "..........";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Parse address into components
const parseAddress = (address) => {
  if (!address) return { street: "", city: "", state: "", zip: "", country: "" };
  const parts = address.split(", ").map(part => part.trim());
  return {
    street: parts[0] || "",
    city: parts[1] || "",
    state: parts[2]?.split(" - ")[0] || "",
    zip: parts[2]?.split(" - ")[1] || "",
    country: parts[3] || "",
  };
};

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profile, setProfile] = useState({
    id: 1,
    f_name: "",
    l_name: "",
    full_name: "",
    user_name: "",
    email: "",
    phone: "",
    phone_code: "",
    prefix: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    dob: "",
    designation: "",
    joinDate: "",
    profile_image: null,
  });
  const [formData, setFormData] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${Base_url}/admin/1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1) {
          const data = response.data.payload;
          const address = "4663 Agriculture Lane, Miami, Florida - 33165, United States."; // Default
          const addressParts = parseAddress(address);
          setProfile({
            id: data.id,
            f_name: data.f_name,
            l_name: data.l_name,
            full_name: data.full_name,
            user_name: data.user_name,
            email: data.email,
            phone: data.phone,
            phone_code: data.phone_code,
            prefix: data.prefix,
            ...addressParts,
            dob: "", // Fetch if available
            designation: "Administrator", // Default or fetch if available
            joinDate: data.created_at, // Use created_at as joinDate
            profile_image: data.profile_image,
          });
          setFormData({
            id: data.id,
            f_name: data.f_name,
            l_name: data.l_name,
            user_name: data.user_name,
            email: data.email,
            phone: data.phone,
            phone_code: data.phone_code,
            prefix: data.prefix,
            ...addressParts,
            dob: "",
            designation: "Administrator",
            joinDate: data.created_at,
            profile_image: data.profile_image,
          });
        }
      } catch (err) {
        setErrors({ general: "Failed to fetch profile. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.f_name.trim()) newErrors.f_name = "First name is required.";
    if (!formData.l_name.trim()) newErrors.l_name = "Last name is required.";
    if (!formData.email.includes("@"))
      newErrors.email = "Please enter a valid email.";
    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    if (!formData.street.trim()) newErrors.street = "Street is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.zip.trim()) newErrors.zip = "Postal code is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("f_name", formData.f_name);
      formPayload.append("l_name", formData.l_name);
      formPayload.append("prefix", formData.prefix);
      formPayload.append("user_name", formData.user_name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("phone_code", formData.phone_code);
      formPayload.append("street", formData.street);
      formPayload.append("city", formData.city);
      formPayload.append("state", formData.state);
      formPayload.append("zip", formData.phone_code);
      formPayload.append("country", formData.country);
      if (imageFile) formPayload.append("profile_image", imageFile);

      const response = await axios.put(`${Base_url}/admin/update/1`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 1) {
        setProfile(formData);
        setProfile((prev) => ({
          ...prev,
          profile_image: imageFile ? URL.createObjectURL(imageFile) : prev.profile_image,
        }));
        setIsEditing(false);
        setErrors({});
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (passwordData.newPassword.length < 8)
      newErrors.newPassword =
        "New password must be at least 8 characters long.";
    if (!/[A-Z]/.test(passwordData.newPassword))
      newErrors.newPassword =
        "New password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(passwordData.newPassword))
      newErrors.newPassword = "New password must contain at least one number.";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword =
        "New password and confirm password do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    if (!validatePassword()) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(`${Base_url}/auth/change-password`, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === 1) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Profile
          </h1>
          <p className="text-gray-600">Dashboard / Profile</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={
                    profile.profile_image
                      ? profile.profile_image
                      : "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={`${profile.full_name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-cyan-100"
                  loading="lazy"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.full_name}
                </h2>
                <p className="text-cyan-600 font-medium">
                  {profile.designation}
                </p>
                <div className="flex items-center mt-2 text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {`${profile.city}, ${profile.state} ${profile.zip}, ${profile.country}`}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Joined {formatDate(profile.joinDate)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-sm"
              disabled={isEditing}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "about"
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "password"
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Personal Details
                </h3>
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">{profile.full_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <p className="text-gray-900">
                          {formatDate(profile.dob)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <p className="text-gray-900">
                          {`${profile.phone_code} ${profile.phone}`}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <p className="text-gray-900">
                          {`${profile.street}, ${profile.city}, ${profile.state} ${profile.zip}, ${profile.country}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {errors.general && (
                      <p className="text-red-500 text-sm">{errors.general}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prefix
                        </label>
                        <input
                          name="prefix"
                          value={formData.prefix}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.prefix ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g., Mr"
                        />
                        {errors.prefix && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.prefix}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          name="f_name"
                          value={formData.f_name}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.f_name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.f_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.f_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          name="l_name"
                          value={formData.l_name}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.l_name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.l_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.l_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.user_name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your username"
                        />
                        {errors.user_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.user_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Code
                        </label>
                        <input
                          name="phone_code"
                          value={formData.phone_code}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.phone_code ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g., +91"
                        />
                        {errors.phone_code && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone_code}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street
                        </label>
                        <input
                          name="street"
                          value={formData.street}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.street ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter street address"
                        />
                        {errors.street && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.street}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          name="zip"
                          value={formData.zip}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.zip ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Postal code"
                        />
                        {errors.zip && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zip}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          name="country"
                          value={formData.country}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.country ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter country"
                        />
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleProfileSave}
                        disabled={isLoading}
                        className={`inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setFormData({ ...profile });
                          setIsEditing(false);
                          setErrors({});
                          setImageFile(null);
                        }}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Change Password
                </h3>
                <div className="max-w-md space-y-6">
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.currentPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.newPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2 text-gray-400" />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2 text-gray-400" />
                        Contains uppercase and lowercase letters
                      </li>
                      <li className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2 text-gray-400" />
                        Contains at least one number
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handlePasswordSave}
                    disabled={isLoading}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        UpdatePassword
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;