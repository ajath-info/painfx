import React, { useState, useEffect } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import axios from "axios";
import BASE_URL from "../../config";
import Loader from "../common/Loader";
const IMAGE_BASE_URL = "http://localhost:5000";

const Toast = ({ message, type, isVisible, setToast }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setToast({ isVisible: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, setToast]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

const ProfileSettings = () => {
  const [form, setForm] = useState({
    prefix: "",
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    phone_code: "+61",
    DOB: "",
    gender: "",
    bio: "",
    profile_image: null,
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    doctor_name: "",
    doctor_address: "",
    permission_to_contact: false,
    referral_source: "",
    referral_name: "",
    injury_location: "",
    reason_for_services: "",
    treatment_goals: "",
    problem_duration: "",
    had_similar_problem: false,
    pain_description: [],
    symptoms: [],
    pain_triggers: [],
    pain_interference: [],
    problem_status: "",
    other_pain_trigger: "",
    insurance_name: "",
    veterans_card_number: "",
    medicare_epc: false,
    claim_through_worker_comp: false,
    type_of_work: "",
    other_health_professionals_seen: "",
    medications: "",
    ever_taken_cortisone: false,
    pregnancy_status: "na",
    high_blood_pressure: false,
    cancer: false,
    heart_problems: false,
    diabetes: false,
  });

  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/user/patient-profile`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = response.data.payload;
        console.log("API Response:", data);

        const parsedData = {
          prefix: data.patient.prefix || "",
          f_name: data.patient.f_name || "",
          l_name: data.patient.l_name || "",
          email: data.patient.email || "",
          phone: data.patient.phone || "",
          phone_code: data.patient.phone_code || "+61",
          DOB: data.patient.DOB
            ? new Date(data.patient.DOB).toISOString().split("T")[0]
            : "",
          gender: data.patient.gender || "",
          bio: data.patient.bio || "",
          profile_image: null,
          address_line1: data.patient.address_line1 || "",
          address_line2: data.patient.address_line2 || "",
          city: data.patient.city || "",
          state: data.patient.state || "",
          country: data.patient.country || "",
          pin_code: data.patient.pin_code || "",
          doctor_name: data.profile.doctor_name || "",
          doctor_address: data.profile.doctor_address || "",
          permission_to_contact: !!data.profile.permission_to_send_letter,
          referral_source: data.profile.referral_source || "",
          referral_name: data.profile.referral_name || "",
          injury_location: data.profile.injury_location || "",
          reason_for_services: data.profile.reason || "",
          treatment_goals: data.profile.treatment_goals || "",
          problem_duration: data.profile.duration_of_problem || "",
          had_similar_problem: !!data.profile.similar_problem_before,
          pain_description: data.profile.pain_description || [],
          symptoms: data.profile.symptoms || [],
          pain_triggers: data.profile.pain_triggers || [],
          pain_interference: data.profile.pain_interference || [],
          problem_status: data.profile.problem_status || "",
          other_pain_trigger: data.profile.other_pain_trigger || "",
          insurance_name: data.profile.private_insurance_name || "",
          veterans_card_number: data.profile.veterans_card_number || "",
          medicare_epc: !!data.profile.has_medicare_plan,
          claim_through_worker_comp: !!data.profile.claiming_compensation,
          type_of_work: data.profile.type_of_work || "",
          other_health_professionals_seen:
            data.profile.other_health_professionals_seen || "",
          medications: data.profile.medications || "",
          ever_taken_cortisone: !!data.profile.taken_cortisone,
          pregnancy_status: data.profile.pregnancy_status || "na",
          high_blood_pressure: !!data.profile.high_blood_pressure,
          cancer: !!data.profile.cancer,
          heart_problems: !!data.profile.heart_problems,
          diabetes: !!data.profile.diabetes,
        };

        setForm(parsedData);
        if (data.patient.profile_image) {
          const imageUrl = data.patient.profile_image.startsWith("http")
            ? data.patient.profile_image
            : `${IMAGE_BASE_URL}${
                data.patient.profile_image.startsWith("/") ? "" : "/"
              }${data.patient.profile_image}`;
          setPreviewImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setToast({
          isVisible: true,
          message: "Failed to load profile data. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.prefix) newErrors.prefix = "Title is required";
    if (!form.f_name.trim()) newErrors.f_name = "First name is required";
    if (!form.l_name.trim()) newErrors.l_name = "Last name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.phone.match(/^\d{10,14}$/)) {
      newErrors.phone = "Invalid phone number (10-14 digits)";
    }
    if (!form.phone_code) newErrors.phone_code = "Phone code is required";
    if (!form.DOB) newErrors.DOB = "Date of birth is required";
    if (!form.injury_location.trim())
      newErrors.injury_location = "Injury location is required";
    if (
      form.problem_status &&
      !["about_same", "getting_better", "getting_worse"].includes(
        form.problem_status
      )
    ) {
      newErrors.problem_status = "Invalid problem status";
    }
    if (
      form.pregnancy_status &&
      !["yes", "no", "na"].includes(form.pregnancy_status)
    ) {
      newErrors.pregnancy_status = "Invalid pregnancy status";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email") return;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profile_image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleMultiSelect = (e, field) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const currentValues = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        };
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
      const data = new FormData();
      if (form.profile_image) data.append("image", form.profile_image);
      if (form.prefix) data.append("prefix", form.prefix);
      if (form.f_name) data.append("f_name", form.f_name);
      if (form.l_name) data.append("l_name", form.l_name);
      if (form.email) data.append("email", form.email);
      if (form.phone) data.append("phone", form.phone);
      if (form.phone_code) data.append("phone_code", form.phone_code);
      if (form.DOB) data.append("DOB", form.DOB);
      if (form.gender) data.append("gender", form.gender);
      if (form.bio) data.append("bio", form.bio);
      if (form.address_line1) data.append("address_line1", form.address_line1);
      if (form.address_line2) data.append("address_line2", form.address_line2);
      if (form.city) data.append("city", form.city);
      if (form.state) data.append("state", form.state);
      if (form.country) data.append("country", form.country);
      if (form.pin_code) data.append("pin_code", form.pin_code);
      if (form.doctor_name) data.append("doctor_name", form.doctor_name);
      if (form.doctor_address)
        data.append("doctor_address", form.doctor_address);
      data.append(
        "permission_to_contact",
        form.permission_to_contact.toString()
      );
      if (form.referral_source)
        data.append("referral_source", form.referral_source);
      if (form.referral_name) data.append("referral_name", form.referral_name);
      if (form.injury_location)
        data.append("injury_location", form.injury_location);
      if (form.reason_for_services)
        data.append("reason_for_services", form.reason_for_services);
      if (form.treatment_goals)
        data.append("treatment_goals", form.treatment_goals);
      if (form.problem_duration)
        data.append("problem_duration", form.problem_duration);
      data.append("had_similar_problem", form.had_similar_problem.toString());
      data.append("pain_description", JSON.stringify(form.pain_description));
      data.append("symptoms", JSON.stringify(form.symptoms));
      data.append("pain_triggers", JSON.stringify(form.pain_triggers));
      data.append("pain_interference", JSON.stringify(form.pain_interference));
      if (form.problem_status)
        data.append("problem_status", form.problem_status);
      if (form.other_pain_trigger)
        data.append("other_pain_trigger", form.other_pain_trigger);
      if (form.insurance_name)
        data.append("insurance_name", form.insurance_name);
      if (form.veterans_card_number)
        data.append("veterans_card_number", form.veterans_card_number);
      data.append("medicare_epc", form.medicare_epc.toString());
      data.append(
        "claim_through_worker_comp",
        form.claim_through_worker_comp.toString()
      );
      if (form.type_of_work) data.append("type_of_work", form.type_of_work);
      if (form.other_health_professionals_seen)
        data.append(
          "other_health_professionals_seen",
          form.other_health_professionals_seen
        );
      if (form.medications) data.append("medications", form.medications);
      data.append("ever_taken_cortisone", form.ever_taken_cortisone.toString());
      if (form.pregnancy_status)
        data.append("pregnancy_status", form.pregnancy_status);
      data.append(
        "medical_conditions",
        JSON.stringify([
          ...(form.high_blood_pressure ? ["high_blood_pressure"] : []),
          ...(form.cancer ? ["cancer"] : []),
          ...(form.heart_problems ? ["heart_problems"] : []),
          ...(form.diabetes ? ["diabetes"] : []),
        ])
      );

      for (let [key, value] of data.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      const response = await axios.put(
        `${BASE_URL}/patient/update-profile`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Profile updated:", response.data);
      setToast({
        isVisible: true,
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        setToast({
          isVisible: true,
          message: `Failed to update profile: ${
            error.response.data.message || "Unknown error"
          }`,
          type: "error",
        });
      } else {
        setToast({
          isVisible: true,
          message: "Failed to update profile. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PatientLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-gray-600 text-lg"><Loader/></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      minimal={true}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          setToast={setToast}
        />
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
                Profile Image
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 self-center sm:self-auto"
                  />
                )}

                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-700 file:cursor-pointer transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                    Accepted formats: JPG, PNG, GIF (Max 2MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="prefix"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="prefix"
                    name="prefix"
                    value={form.prefix}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.prefix ? "border-red-500" : "border-gray-300"
                    } bg-gray-50`}
                    required
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                  {errors.prefix && (
                    <p className="text-red-500 text-sm mt-1">{errors.prefix}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-6">
                    {["male", "female", "other"].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={form.gender === option}
                          onChange={handleChange}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="f_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="f_name"
                    type="text"
                    name="f_name"
                    value={form.f_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.f_name ? "border-red-500" : "border-gray-300"
                    } bg-gray-50`}
                    required
                  />
                  {errors.f_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.f_name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="l_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="l_name"
                    type="text"
                    name="l_name"
                    value={form.l_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.l_name ? "border-red-500" : "border-gray-300"
                    } bg-gray-50`}
                    required
                  />
                  {errors.l_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.l_name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="DOB"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="DOB"
                    type="date"
                    name="DOB"
                    value={form.DOB}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.DOB ? "border-red-500" : "border-gray-300"
                    } bg-gray-50`}
                    required
                  />
                  {errors.DOB && (
                    <p className="text-red-500 text-sm mt-1">{errors.DOB}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    readOnly
                    disabled
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  {/* Phone Code */}
                  <div className="sm:w-1/3 w-full">
                    <label
                      htmlFor="phone_code"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Code <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="phone_code"
                      name="phone_code"
                      value={form.phone_code}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                      required
                    >
                      <option value="">Select Code</option>
                      <option value="+91">+91</option>
                      <option value="+61">+61</option>
                    </select>
                    {errors.phone_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone_code}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="sm:w-2/3 w-full">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleChange(e); // Only allow up to 10 digits
                        }
                      }}
                      maxLength={10}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } bg-gray-50`}
                      required
                    />

                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address_line1"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address Line 1
                  </label>
                  <input
                    id="address_line1"
                    type="text"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address_line2"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address Line 2
                  </label>
                  <input
                    id="address_line2"
                    type="text"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pin_code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Postal Code
                  </label>
                  <input
                    id="pin_code"
                    type="text"
                    name="pin_code"
                    value={form.pin_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor's Name */}
                <div className="w-full">
                  <label
                    htmlFor="doctor_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doctor's Name
                  </label>
                  <input
                    id="doctor_name"
                    type="text"
                    name="doctor_name"
                    value={form.doctor_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>

                {/* Doctor's Address */}
                <div className="w-full">
                  <label
                    htmlFor="doctor_address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doctor's Address
                  </label>
                  <input
                    id="doctor_address"
                    type="text"
                    name="doctor_address"
                    value={form.doctor_address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>

                {/* Checkbox full width */}
                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-start md:items-center gap-2">
                    <input
                      type="checkbox"
                      name="permission_to_contact"
                      checked={form.permission_to_contact}
                      onChange={handleChange}
                      className="mt-1 md:mt-0 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Permission to contact your doctor
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Referral Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="referral_source"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    How did you find out about this practice?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="referral_source"
                    name="referral_source"
                    value={form.referral_source}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    required
                  >
                    <option value="">Select Referral Source</option>
                    <option value="Advert/Poster">Advert/Poster</option>
                    <option value="Brochure/Flyer">Brochure/Flyer</option>
                    <option value="Yellow Pages">Yellow Pages</option>
                    <option value="Yellow Pages Online">
                      Yellow Pages Online
                    </option>
                    <option value="Directory Assist">Directory Assist</option>
                    <option value="Our Website">Our Website</option>
                    <option value="From My Doctor">From My Doctor</option>
                    <option value="Friend/Referral">Friend/Referral</option>
                  </select>
                </div>
                {form.referral_source === "Friend/Referral" && (
                  <div>
                    <label
                      htmlFor="referral_name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Referral Name
                    </label>
                    <input
                      id="referral_name"
                      type="text"
                      name="referral_name"
                      value={form.referral_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Injury Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="injury_location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Injury Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="injury_location"
                    type="text"
                    name="injury_location"
                    value={form.injury_location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.injury_location
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50`}
                    required
                  />
                  {errors.injury_location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.injury_location}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="reason_for_services"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for Seeking Services
                  </label>
                  <textarea
                    id="reason_for_services"
                    name="reason_for_services"
                    value={form.reason_for_services}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    rows="4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="treatment_goals"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Treatment Goals
                  </label>
                  <textarea
                    id="treatment_goals"
                    name="treatment_goals"
                    value={form.treatment_goals}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    rows="4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="problem_duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    How long have you had this problem?
                  </label>
                  <input
                    id="problem_duration"
                    type="text"
                    name="problem_duration"
                    value={form.problem_duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="had_similar_problem"
                    checked={form.had_similar_problem}
                    onChange={handleChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Had this or a similar problem in the past
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Description
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  "Constant",
                  "Comes & goes",
                  "Sharp",
                  "Dull Achy",
                  "Intensity varies",
                  "Intensity doesn't vary",
                  "Shooting",
                  "Radiates",
                  "Travels",
                ].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={form.pain_description.includes(option)}
                      onChange={(e) => handleMultiSelect(e, "pain_description")}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Symptoms
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {["Pins and needles", "Tingling", "Numbness", "Weakness"].map(
                  (option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={form.symptoms.includes(option)}
                        onChange={(e) => handleMultiSelect(e, "symptoms")}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Problem Status
              </h3>
              <div className="flex space-x-6">
                {["about_same", "getting_better", "getting_worse"].map(
                  (option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="problem_status"
                        value={option}
                        checked={form.problem_status === option}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option.replace("_", " ").charAt(0).toUpperCase() +
                          option.replace("_", " ").slice(1)}
                      </span>
                    </label>
                  )
                )}
              </div>
              {errors.problem_status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.problem_status}
                </p>
              )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Triggers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["Sitting", "Standing up from a chair", "Walking"].map(
                  (option) => (
                    <label
                      key={option}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={form.pain_triggers.includes(option)}
                        onChange={(e) => handleMultiSelect(e, "pain_triggers")}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      {option}
                    </label>
                  )
                )}

                {/* Other input */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="other_pain_trigger"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Other
                  </label>
                  <input
                    id="other_pain_trigger"
                    type="text"
                    name="other_pain_trigger"
                    value={form.other_pain_trigger}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Interference
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {["Work", "Sleep", "Hobbies", "Leisure"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={form.pain_interference.includes(option)}
                      onChange={(e) =>
                        handleMultiSelect(e, "pain_interference")
                      }
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="insurance_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Private Health Insurance (Name)
                  </label>
                  <input
                    id="insurance_name"
                    type="text"
                    name="insurance_name"
                    value={form.insurance_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="veterans_card_number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Veterans Affairs Card Number
                  </label>
                  <input
                    id="veterans_card_number"
                    type="text"
                    name="veterans_card_number"
                    value={form.veterans_card_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="medicare_epc"
                    checked={form.medicare_epc}
                    onChange={handleChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Medicare EPC Plan
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="claim_through_worker_comp"
                    checked={form.claim_through_worker_comp}
                    onChange={handleChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Claiming through Worker's Compensation or CTP
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Medical History
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="type_of_work"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Type of Work
                  </label>
                  <input
                    id="type_of_work"
                    type="text"
                    name="type_of_work"
                    value={form.type_of_work}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="other_health_professionals_seen"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Other Health Professionals Seen
                  </label>
                  <textarea
                    id="other_health_professionals_seen"
                    name="other_health_professionals_seen"
                    value={form.other_health_professionals_seen}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    rows="4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="medications"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Medications
                  </label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={form.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 bg-gray-50"
                    rows="4"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="ever_taken_cortisone"
                    checked={form.ever_taken_cortisone}
                    onChange={handleChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Ever taken oral cortisone or prednisone
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pregnancy Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-6">
                    {["yes", "no", "na"].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="pregnancy_status"
                          value={option}
                          checked={form.pregnancy_status === option}
                          onChange={handleChange}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          {option.toUpperCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.pregnancy_status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pregnancy_status}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      "high_blood_pressure",
                      "cancer",
                      "heart_problems",
                      "diabetes",
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          name={option}
                          checked={form[option]}
                          onChange={handleChange}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {option.replace("_", " ").charAt(0).toUpperCase() +
                            option.replace("_", " ").slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg text-cyan-500 font-semibold transition-colors ${
                  isSubmitting
                    ? "border border-cyan-500 bg-white hover:bg-cyan-500 hover:text-white roundedcursor-not-allowed "
                    : "border border-cyan-500 bg-white hover:bg-cyan-500 hover:text-white rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ProfileSettings;
