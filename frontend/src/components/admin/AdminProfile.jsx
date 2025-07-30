import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import Base_url from "../../config";
import avtarImage from "../../images/avtarimage.webp";
const IMAGE_BASE_URL = "http://localhost:5000";

// Helper function to format profile image URL
const formatProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return avtarImage;

  // If it's already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative path from database, prepend BASE_URL
  return `${IMAGE_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

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
    id: "",
    f_name: "",
    l_name: "",
    full_name: "",
    prefix: "",
    email: "",
    phone: "",
    phone_code: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    created_at: "",
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
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id || 1;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${Base_url}/admin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 1) {
          const data = response.data.payload;
          setProfile({
            id: data.id,
            f_name: data.f_name || "",
            l_name: data.l_name || "",
            full_name: data.full_name || "",
            prefix: data.prefix || "",
            email: data.email || "",
            phone: data.phone || "",
            phone_code: data.phone_code || "",
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            pin_code: data.pin_code || "",
            created_at: data.created_at || "",
            profile_image: formatProfileImageUrl(data.profile_image),
          });
          setFormData({
            id: data.id,
            f_name: data.f_name || "",
            l_name: data.l_name || "",
            prefix: data.prefix || "",
            email: data.email || "",
            phone: data.phone || "",
            phone_code: data.phone_code || "",
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            pin_code: data.pin_code || "",
            profile_image: formatProfileImageUrl(data.profile_image),
          });
        } else {
          setErrors({
            general: response.data.message || "Failed to fetch profile",
          });
        }
      } catch (err) {
        setErrors({
          general:
            err.response?.data?.message ||
            "Failed to fetch profile. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, userId]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (formData.f_name && formData.f_name.trim() === "") {
      newErrors.f_name = "First name cannot be empty.";
    }
    if (formData.l_name && formData.l_name.trim() === "") {
      newErrors.l_name = "Last name cannot be empty.";
    }
    if (
      formData.prefix &&
      !["Mr", "Mrs", "Ms", "Dr"].includes(formData.prefix)
    ) {
      newErrors.prefix = "Invalid prefix. Must be Mr, Mrs, Ms, or Dr.";
    }
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email.";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (formData.phone_code && !["+61", "+91"].includes(formData.phone_code)) {
      newErrors.phone_code = "Please select a valid phone code.";
    }
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
      formPayload.append("phone", formData.phone);
      formPayload.append("phone_code", formData.phone_code);
      formPayload.append("address_line1", formData.address_line1);
      formPayload.append("address_line2", formData.address_line2);
      formPayload.append("city", formData.city);
      formPayload.append("state", formData.state);
      formPayload.append("country", formData.country);
      formPayload.append("pin_code", formData.pin_code);
      if (imageFile) formPayload.append("image", imageFile);

      const response = await axios.put(
        `${Base_url}/admin/update/${formData.id || userId}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 1) {
        setProfile({
          ...formData,
          profile_image: imageFile
            ? URL.createObjectURL(imageFile)
            : formData.profile_image,
          full_name: `${formData.prefix || profile.prefix} ${
            formData.f_name || profile.f_name
          } ${formData.l_name || profile.l_name}`,
        });
        setIsEditing(false);
        setErrors({});
        setSuccessMessage(
          response.data.message || "Profile updated successfully!"
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({
          general: response.data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
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
      const response = await axios.patch(
        `${Base_url}/auth/change-password`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setPasswordError(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format address with proper handling of empty fields
  const formatAddress = () => {
    const parts = [];
    if (profile.address_line1) parts.push(profile.address_line1);
    if (profile.address_line2) parts.push(profile.address_line2);
    if (profile.city) parts.push(profile.city);
    if (profile.state) parts.push(profile.state);
    if (profile.pin_code) parts.push(profile.pin_code);
    if (profile.country) parts.push(profile.country);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Profile
          </h1>
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
                <p className="text-cyan-600 font-medium">Administrator</p>
                <div className="flex items-center mt-2 text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatAddress()}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Joined {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer mt-4 md:mt-0 inline-flex justify-center items-center text-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-sm"
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
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
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
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
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
                          Email Address
                        </label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <p className="text-gray-900">
                          {`${profile.phone_code} ${profile.phone}`}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <p className="text-gray-900">{formatAddress()}</p>
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
                        <select
                          name="prefix"
                          value={formData.prefix}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.prefix ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Prefix</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
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
                          disabled
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
                        <select
                          name="phone_code"
                          value={formData.phone_code}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.phone_code
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Code</option>
                          <option value="+61">+61</option>
                          <option value="+91">+91</option>
                        </select>
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
                          onKeyDown={(e) => {
                            // Allow navigation keys and digits only
                            const allowedKeys = [
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ];
                            if (
                              !/[0-9]/.test(e.key) &&
                              !allowedKeys.includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10} // Optional: prevents typing more than 10 digits
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <input
                          name="address_line1"
                          value={formData.address_line1}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.address_line1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter address line 1"
                        />
                        {errors.address_line1 && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.address_line1}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          name="address_line2"
                          value={formData.address_line2}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300"
                          placeholder="Enter address line 2 (optional)"
                        />
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
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleProfileChange}
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ];
                            if (
                              !/[0-9]/.test(e.key) &&
                              !allowedKeys.includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={6}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.pin_code
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter postal code"
                        />
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
                            errors.country
                              ? "border-red-500"
                              : "border-gray-300"
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
                        className={`inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 cursor-pointer text-white rounded-lg transition-colors ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 "></div>
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
                        className="inline-flex items-center px-6 py-3 border border-cyan-500 cursor-pointer hover:bg-cyan-500 hover:text-white text-cyan-500 rounded-lg transition-colors"
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
                        Update Password
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
