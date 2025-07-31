import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorLayout from "../../layouts/DoctorLayout";
import BASE_URL from "../../config";
import Loader from "../../components/common/Loader";

const IMAGE_BASE_URL = "http://localhost:5000";

const DoctorProfileForm = () => {
  const [services, setServices] = useState(["Tooth cleaning"]);
  const [newService, setNewService] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [educations, setEducations] = useState([
    { degree: "", institution: "", year_of_passing: "" },
  ]);
  const [experiences, setExperiences] = useState([
    {
      hospital: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      designation: "",
    },
  ]);
  const [awards, setAwards] = useState([{ title: "", year: "" }]);
  const [memberships, setMemberships] = useState([""]);
  const [registrations, setRegistrations] = useState([
    { registration_number: "", registration_date: "" },
  ]);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    prefix: "Dr",
    f_name: "",
    l_name: "",
    phone: "",
    phone_code: "+61",
    DOB: "",
    gender: "male",
    bio: "",
    profile_image: null,
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    consultation_fee_type: "free",
    consultation_fee: 0,
    username: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const selectRef = useRef(null);

  // Helper function to format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Generate years for dropdowns (1900 to 2025)
  const generateYears = () => {
    const years = [];
    for (let year = 2025; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  // Validate phone number
  const isValidPhone = (phone) => {
    return !phone || /^\+?\d{7,15}$/.test(phone);
  };

  // Validate form data
  const validateForm = () => {
    const errors = [];

    // Profile validations
    if (!profile.f_name.trim()) errors.push("First Name is required.");
    if (!profile.l_name.trim()) errors.push("Last Name is required.");
    if (!profile.DOB) {
      errors.push("Date of Birth is required.");
    } else {
      const dob = new Date(profile.DOB);
      const minAgeDate = new Date("2005-07-30");
      if (dob > minAgeDate) {
        errors.push("You must be at least 20 years old.");
      }
    }
    if (!profile.gender) errors.push("Gender is required.");
    if (profile.phone && !isValidPhone(profile.phone)) {
      errors.push("Phone number is invalid (must be 7-15 digits).");
    }
    if (profile.consultation_fee_type === "paid") {
      if (
        !profile.consultation_fee ||
        isNaN(profile.consultation_fee) ||
        profile.consultation_fee < 0 ||
        !Number.isInteger(Number(profile.consultation_fee))
      ) {
        errors.push("Consultation fee must be a non-negative integer.");
      }
    }

    // Services validations
    if (services.length === 0) {
      errors.push("At least one service is required.");
    } else {
      const uniqueServices = new Set(
        services.map((s) => s.toLowerCase().trim())
      );
      if (uniqueServices.size !== services.length) {
        errors.push("Duplicate services are not allowed.");
      }
      if (services.some((s) => !s.trim())) {
        errors.push("Services cannot be empty.");
      }
    }

    // Specializations validations
    if (specializations.length === 0) {
      errors.push("At least one specialization is required.");
    } else if (
      !specializations.every((id) =>
        allSpecializations.some((spec) => spec.id === id)
      )
    ) {
      errors.push("One or more selected specializations are invalid.");
    }

    // Educations validations
    if (
      educations.length === 0 ||
      educations.every(
        (edu) =>
          !edu.degree.trim() && !edu.institution.trim() && !edu.year_of_passing
      )
    ) {
      errors.push("At least one valid education entry is required.");
    } else {
      educations.forEach((edu, i) => {
        if (
          edu.degree.trim() ||
          edu.institution.trim() ||
          edu.year_of_passing
        ) {
          if (!edu.degree.trim())
            errors.push(`Education ${i + 1}: Degree is required.`);
          if (!edu.institution.trim())
            errors.push(`Education ${i + 1}: Institution is required.`);
          if (!edu.year_of_passing) {
            errors.push(`Education ${i + 1}: Year of completion is required.`);
          } else if (edu.year_of_passing < 1900 || edu.year_of_passing > 2025) {
            errors.push(
              `Education ${i + 1}: Year must be between 1900 and 2025.`
            );
          }
        }
      });
    }

    // Experiences validations
    if (
      experiences.length === 0 ||
      experiences.every(
        (exp) =>
          !exp.hospital.trim() && !exp.start_date && !exp.designation.trim()
      )
    ) {
      errors.push("At least one valid experience entry is required.");
    } else {
      const today = new Date("2025-07-30");
      experiences.forEach((exp, i) => {
        if (
          exp.hospital.trim() ||
          exp.start_date ||
          exp.end_date ||
          exp.designation.trim()
        ) {
          if (!exp.hospital.trim())
            errors.push(`Experience ${i + 1}: Hospital name is required.`);
          if (!exp.start_date)
            errors.push(`Experience ${i + 1}: Start date is required.`);
          if (!exp.designation.trim())
            errors.push(`Experience ${i + 1}: Designation is required.`);
          if (exp.start_date) {
            const startDate = new Date(exp.start_date);
            if (startDate > today) {
              errors.push(
                `Experience ${i + 1}: Start date cannot be in the future.`
              );
            }
          }
          if (!exp.currently_working && !exp.end_date) {
            errors.push(
              `Experience ${
                i + 1
              }: End date is required unless currently working.`
            );
          }
          if (!exp.currently_working && exp.end_date) {
            const endDate = new Date(exp.end_date);
            if (endDate > today) {
              errors.push(
                `Experience ${i + 1}: End date cannot be in the future.`
              );
            }
            if (exp.start_date && endDate <= new Date(exp.start_date)) {
              errors.push(
                `Experience ${i + 1}: End date must be after start date.`
              );
            }
          }
        }
      });
    }

    // Awards validations
    awards.forEach((award, i) => {
      if (award.title.trim() || award.year) {
        if (!award.title.trim())
          errors.push(`Award ${i + 1}: Title is required.`);
        if (!award.year) {
          errors.push(`Award ${i + 1}: Year is required.`);
        } else if (award.year < 1900 || award.year > 2025) {
          errors.push(`Award ${i + 1}: Year must be between 1900 and 2025.`);
        }
      }
    });

    // Memberships validations
    memberships.forEach((membership, i) => {
      if (membership.trim() === "") {
        errors.push(`Membership ${i + 1}: Cannot be empty if provided.`);
      }
    });

    // Registration validations
    if (
      registrations[0].registration_number.trim() ||
      registrations[0].registration_date
    ) {
      if (!registrations[0].registration_number.trim()) {
        errors.push(
          "Registration: Registration number is required if date is provided."
        );
      }
      if (!registrations[0].registration_date) {
        errors.push(
          "Registration: Registration date is required if number is provided."
        );
      } else {
        const regDate = new Date(registrations[0].registration_date);
        if (regDate > new Date("2025-07-30")) {
          errors.push(
            "Registration: Registration date cannot be in the future."
          );
        }
      }
    }

    // Profile image validation
    if (profile.profile_image) {
      if (
        !["image/jpeg", "image/png", "image/gif"].includes(
          profile.profile_image.type
        )
      ) {
        errors.push("Profile image must be JPG, PNG, or GIF.");
      }
      if (profile.profile_image.size > 2 * 1024 * 1024) {
        errors.push("Profile image size must be less than 2MB.");
      }
    }

    return errors;
  };

  // Debounced search function for specializations
  const searchSpecializations = useCallback(
    debounce(async (query) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          setAvailableSpecializations([]);
          return;
        }

        if (!query.trim()) {
          setAvailableSpecializations(allSpecializations);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/doctor/search-specialization?search=${encodeURIComponent(
            query.trim()
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const specializationsData = Array.isArray(response.data.payload)
          ? response.data.payload
          : Array.isArray(response.data)
          ? response.data
          : [];

        // Update available specializations with search results
        setAvailableSpecializations(specializationsData);

        // Merge search results with allSpecializations to ensure consistency
        setAllSpecializations((prev) => {
          const existingIds = new Set(prev.map((spec) => spec.id));
          const newSpecializations = specializationsData.filter(
            (spec) => !existingIds.has(spec.id)
          );
          return [...prev, ...newSpecializations];
        });
      } catch (err) {
        console.error(
          "Search Specializations Error:",
          err.response?.data || err.message
        );
        toast.error(
          `Error searching specializations: ${
            err.response?.data?.message || err.message || "Please try again."
          }`
        );
        setAvailableSpecializations([]);
      }
    }, 1000), // Debounce for 1 second
    [allSpecializations]
  );

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          setIsLoading(false);
          return;
        }

        // Fetch doctor profile
        const profileRes = await axios.get(`${BASE_URL}/user/doctor-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const doctorData = profileRes.data.payload?.doctor || {};

        // Map profile data
        const profileData = {
          prefix: doctorData.prefix || "Dr",
          f_name: doctorData.f_name || "",
          l_name: doctorData.l_name || "",
          phone: doctorData.phone || "",
          phone_code: doctorData.phone_code || "+61",
          DOB: formatDateForInput(doctorData.DOB),
          gender: doctorData.gender || "male",
          bio: doctorData.bio || "",
          profile_image: null,
          address_line1: doctorData.address_line1 || "",
          address_line2: doctorData.address_line2 || "",
          city: doctorData.city || "",
          state: doctorData.state || "",
          country: doctorData.country || "",
          pin_code: doctorData.pin_code || "",
          consultation_fee_type: doctorData.consultation_fee_type || "free",
          consultation_fee: parseInt(doctorData.consultation_fee) || 0,
          username: doctorData.user_name || "",
          email: doctorData.email || "",
        };
        setProfile(profileData);

        if (doctorData.profile_image) {
          const imageUrl = doctorData.profile_image.startsWith("http")
            ? doctorData.profile_image
            : `${IMAGE_BASE_URL}${
                doctorData.profile_image.startsWith("/") ? "" : "/"
              }${doctorData.profile_image}`;
          setPreviewImage(imageUrl);
        }

        // Map educations data
        const educationData = profileRes.data.payload?.educations || [];
        const mappedEducations =
          educationData.length > 0
            ? educationData.map((edu) => ({
                degree: edu.degree || "",
                institution: edu.institution || "",
                year_of_passing: edu.year_of_passing?.toString() || "",
              }))
            : [{ degree: "", institution: "", year_of_passing: "" }];
        setEducations(mappedEducations);

        // Map experiences data
        const experienceData = profileRes.data.payload?.experiences || [];
        const mappedExperiences =
          experienceData.length > 0
            ? experienceData.map((exp) => ({
                hospital: exp.hospital || "",
                start_date: formatDateForInput(exp.start_date),
                end_date: exp.end_date ? formatDateForInput(exp.end_date) : "",
                currently_working: exp.currently_working || false,
                designation: exp.designation || "",
              }))
            : [
                {
                  hospital: "",
                  start_date: "",
                  end_date: "",
                  currently_working: false,
                  designation: "",
                },
              ];
        setExperiences(mappedExperiences);

        // Map awards data
        const awardData = profileRes.data.payload?.awards || [];
        const mappedAwards =
          awardData.length > 0
            ? awardData.map((award) => ({
                title: award.title || "",
                year: award.year?.toString() || "",
              }))
            : [{ title: "", year: "" }];
        setAwards(mappedAwards);

        // Map memberships data
        const membershipData = profileRes.data.payload?.memberships || [];
        const mappedMemberships =
          membershipData.length > 0
            ? membershipData.map((membership) => membership.text || "")
            : [""];
        setMemberships(mappedMemberships);

        // Map registration data
        const registrationData = profileRes.data.payload?.registration;
        const mappedRegistrations = registrationData
          ? [
              {
                registration_number: registrationData.registration_number || "",
                registration_date: formatDateForInput(
                  registrationData.registration_date
                ),
              },
            ]
          : [{ registration_number: "", registration_date: "" }];
        setRegistrations(mappedRegistrations);

        // Map clinics data (read-only)
        const clinicData = profileRes.data.payload?.clinics || [];
        setClinics(clinicData);

        // Map services data
        const serviceData = profileRes.data.payload?.services || [];
        const mappedServices =
          serviceData.length > 0
            ? serviceData.map(
                (service) =>
                  service.name || service.service_name || "Unknown Service"
              )
            : ["Tooth cleaning"];
        setServices(mappedServices);

        // Map specializations data
        const specializationData =
          profileRes.data.payload?.specializations || [];
        const mappedSpecializations = specializationData
          .map((spec) => spec.specialization_id)
          .filter((id) => id);
        setSpecializations(mappedSpecializations);

        // Merge specializations from doctor-profile into allSpecializations
        const profileSpecializations = specializationData.map((spec) => ({
          id: spec.specialization_id,
          name: spec.name,
        }));

        // Fetch all available specializations
        const specsRes = await axios.get(
          `${BASE_URL}/doctor/get-specializations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const specializationsData = Array.isArray(specsRes.data.payload)
          ? specsRes.data.payload
          : Array.isArray(specsRes.data)
          ? specsRes.data
          : [];

        // Combine profile specializations with fetched specializations, avoiding duplicates
        const combinedSpecializations = [
          ...profileSpecializations,
          ...specializationsData.filter(
            (spec) => !profileSpecializations.some((ps) => ps.id === spec.id)
          ),
        ];
        setAllSpecializations(combinedSpecializations);
        setAvailableSpecializations(combinedSpecializations);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        toast.error(
          `Error fetching initial data: ${
            err.response?.data?.message || err.message
          }`
        );
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
  const addEducation = () =>
    setEducations([
      ...educations,
      { degree: "", institution: "", year_of_passing: "" },
    ]);
  const deleteEducation = (index) =>
    setEducations(educations.filter((_, i) => i !== index));
  const addExperience = () =>
    setExperiences([
      ...experiences,
      {
        hospital: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        designation: "",
      },
    ]);
  const addAward = () => setAwards([...awards, { title: "", year: "" }]);
  const addMembership = () => setMemberships([...memberships, ""]);

  const handleProfileChange = (field, value) => {
    if (field === "consultation_fee") {
      const intValue = value === "" ? "" : parseInt(value);
      setProfile((prev) => ({ ...prev, [field]: intValue }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    if (field === "currently_working" && value) {
      updated[index].end_date = "";
    }
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

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Profile image must be JPG, PNG, or GIF.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image size must be less than 2MB.");
      return;
    }

    setProfile((prev) => ({ ...prev, profile_image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    setIsLoading(true);
    setMessage("");

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(
        <div>
          <p>Please fix the following errors:</p>
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
        { autoClose: 5000 }
      );
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const data = new FormData();
      if (profile.profile_image) data.append("image", profile.profile_image);

      const profileData = {
        profile: {
          ...profile,
          consultation_fee:
            profile.consultation_fee_type === "paid"
              ? parseInt(profile.consultation_fee) || 0
              : 0,
          profile_image: undefined,
          username: undefined,
          email: undefined,
        },
        services,
        specializations,
        educations: educations
          .map((edu) => ({
            degree: edu.degree || "",
            institution: edu.institution || "",
            year_of_passing: parseInt(edu.year_of_passing) || null,
          }))
          .filter(
            (edu) => edu.degree && edu.institution && edu.year_of_passing
          ),
        experiences: experiences
          .map((exp) => ({
            hospital: exp.hospital || "",
            start_date: exp.start_date || "",
            end_date: exp.currently_working ? "" : exp.end_date || "",
            currently_working: exp.currently_working,
            designation: exp.designation || "",
          }))
          .filter((exp) => exp.hospital && exp.start_date && exp.designation),
        awards: awards
          .map((award) => ({
            title: award.title || "",
            year: parseInt(award.year) || null,
          }))
          .filter((award) => award.title && award.year),
        memberships: memberships
          .map((m) => ({ text: m || "" }))
          .filter((m) => m.text),
        registration:
          registrations[0].registration_number &&
          registrations[0].registration_date
            ? {
                registration_number: registrations[0].registration_number || "",
                registration_date: registrations[0].registration_date || "",
              }
            : null,
        clinics,
      };

      data.append("data", JSON.stringify(profileData));

      await axios.put(`${BASE_URL}/doctor/master-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error.response?.data || error.message
      );
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle specialization selection
  const handleSpecializationSelect = (id) => {
    if (!specializations.includes(id)) {
      setSpecializations([...specializations, id]);
    }
    setSearchQuery("");
    setAvailableSpecializations(allSpecializations);
    if (selectRef.current) {
      selectRef.current.focus();
    }
  };

  const removeSpecialization = (id) => {
    setSpecializations(specializations.filter((specId) => specId !== id));
  };

  const handleServiceInputKeyPress = (e) => {
    if (e.key === "Enter" && newService.trim()) {
      e.preventDefault();
      if (
        services
          .map((s) => s.toLowerCase().trim())
          .includes(newService.toLowerCase().trim())
      ) {
        toast.error("Service already exists.");
        return;
      }
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <Loader/>
            </div>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <ToastContainer />
      <div className="container mx-auto px-4 py-6">
        <div className="w-full">
          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              } flex justify-between items-center`}
            >
              {message}
              <button
                onClick={() => setMessage("")}
                className="text-lg font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Basic Information</h4>
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    previewImage || "/assets/img/doctors/doctor-thumb-02.jpg"
                  }
                  alt="Profile"
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
                  <p className="text-xs text-gray-500">
                    Allowed JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Username", field: "username", disabled: true },
                { label: "Email", field: "email", disabled: true },
                { label: "First Name", field: "f_name", required: true },
                { label: "Last Name", field: "l_name", required: true },
                { label: "Phone Number", field: "phone" },
                {
                  label: "Gender",
                  field: "gender",
                  type: "select",
                  required: true,
                },
                {
                  label: "Date of Birth",
                  field: "DOB",
                  type: "date",
                  required: true,
                  max: "2005-07-30",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {item.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.type === "select" ? (
                    <select
                      className={`mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        ["username", "email"].includes(item.field)
                          ? "bg-gray-100"
                          : ""
                      }`}
                      value={profile[item.field] || ""}
                      onChange={(e) =>
                        handleProfileChange(item.field, e.target.value)
                      }
                      disabled={item.disabled}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={item.type || "text"}
                      value={profile[item.field] || ""}
                      onChange={(e) =>
                        handleProfileChange(item.field, e.target.value)
                      }
                      className={`mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        ["username", "email"].includes(item.field)
                          ? "bg-gray-100"
                          : ""
                      }`}
                      readOnly={item.disabled}
                      max={item.max}
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
              <label className="text-sm font-medium text-gray-700">
                Biography
              </label>
              <textarea
                className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                value={profile.bio || ""}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Clinic Info (Read-Only) */}
          {clinics.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-xl font-semibold mb-4">Clinic Info</h4>
              {clinics.map((clinic, i) => (
                <div key={i} className="mb-4 border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Clinic Name", field: "name" },
                      { label: "Address Line 1", field: "address_line1" },
                      { label: "Address Line 2", field: "address_line2" },
                      { label: "City", field: "city" },
                      { label: "State", field: "state" },
                      { label: "Country", field: "country" },
                      { label: "Postal Code", field: "pin_code" },
                    ].map((item, j) => (
                      <div key={j} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                          {item.label}
                        </label>
                        <input
                          type="text"
                          className="mt-1 p-2 border rounded-md bg-gray-100"
                          value={clinic[item.field] || ""}
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Details */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Address Line 1", field: "address_line1" },
                { label: "Address Line 2", field: "address_line2" },
                { label: "City", field: "city" },
                { label: "State / Province", field: "state" },
                { label: "Country", field: "country" },
                { label: "Postal Code", field: "pin_code" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={profile[item.field] || ""}
                    onChange={(e) =>
                      handleProfileChange(item.field, e.target.value)
                    }
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
                  checked={profile.consultation_fee_type === "free"}
                  onChange={(e) =>
                    handleProfileChange("consultation_fee_type", e.target.value)
                  }
                  className="mr-2"
                />
                Free
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rating_option"
                  value="paid"
                  checked={profile.consultation_fee_type === "paid"}
                  onChange={(e) =>
                    handleProfileChange("consultation_fee_type", e.target.value)
                  }
                  className="mr-2"
                />
                Custom Price (per hour)
              </label>
            </div>
            {profile.consultation_fee_type === "paid" && (
              <div className="w-full md:w-1/3">
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={profile.consultation_fee || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number.isInteger(Number(value))) {
                      handleProfileChange("consultation_fee", value);
                    }
                  }}
                  placeholder="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a non-negative integer price
                </p>
              </div>
            )}
          </div>

          {/* Services and Specialization */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">
              Services and Specialization
            </h4>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">
                Services <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a service and press Enter"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={handleServiceInputKeyPress}
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to add new services
              </p>
              {services.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No services assigned. Add services above.
                </p>
              )}
              {services.length > 0 && (
                <div className="mt-2">
                  {services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 mr-2 mb-2"
                    >
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
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">
                Search Specializations <span className="text-red-500">*</span>
              </label>
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
                    onClick={() => {
                      setSearchQuery("");
                      setAvailableSpecializations(allSpecializations);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type to search for specializations
              </p>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-700">
                Select Specializations <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  multiple
                  ref={selectRef}
                  className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full h-32"
                  size="5"
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    if (selectedId) {
                      handleSpecializationSelect(selectedId);
                    }
                  }}
                >
                  {Array.isArray(availableSpecializations) &&
                  availableSpecializations.length > 0 ? (
                    availableSpecializations.map((spec) => (
                      <option
                        key={spec.id}
                        value={spec.id}
                        className={
                          specializations.includes(spec.id) ? "bg-blue-100" : ""
                        }
                      >
                        {spec.name || "Unknown Specialization"}
                      </option>
                    ))
                  ) : (
                    <option disabled>No specializations available</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Click to select specializations (hold Ctrl/Cmd for multiple)
                </p>
              </div>
              {Array.isArray(allSpecializations) &&
                specializations.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold mb-2">
                      Selected Specializations
                    </h5>
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Specialization
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {specializations.map((specializationId) => {
                          const spec = allSpecializations.find(
                            (s) => s.id === specializationId
                          ) || { name: "Unknown Specialization" };
                          return (
                            <tr
                              key={specializationId}
                              className="hover:bg-gray-50"
                            >
                              <td className="border border-gray-300 px-4 py-2">
                                {spec.name}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <button
                                  className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                  onClick={() =>
                                    removeSpecialization(specializationId)
                                  }
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
                <p className="text-sm text-gray-500 mt-2">
                  No specializations selected. Choose from the list above.
                </p>
              )}
              {!Array.isArray(allSpecializations) && (
                <p className="text-sm text-red-500 mt-2">
                  Failed to load specializations. Please try again.
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">
              Education <span className="text-red-500">*</span>
            </h4>
            <div className="space-y-4">
              {educations.map((edu, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={edu.degree || ""}
                      onChange={(e) =>
                        handleEducationChange(i, "degree", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-4 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      College/Institute
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={edu.institution || ""}
                      onChange={(e) =>
                        handleEducationChange(i, "institution", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Year of Completion
                    </label>
                    <select
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={edu.year_of_passing || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          i,
                          "year_of_passing",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Year</option>
                      {generateYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
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
              ))}
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
            <h4 className="text-xl font-semibold mb-4">
              Experience <span className="text-red-500">*</span>
            </h4>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-14 gap-4">
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.hospital || ""}
                      onChange={(e) =>
                        handleExperienceChange(i, "hospital", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      From
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.start_date || ""}
                      onChange={(e) =>
                        handleExperienceChange(i, "start_date", e.target.value)
                      }
                      max="2025-07-30"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      To
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={exp.end_date || ""}
                      onChange={(e) =>
                        handleExperienceChange(i, "end_date", e.target.value)
                      }
                      max="2025-07-30"
                      disabled={exp.currently_working}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={exp.designation || ""}
                      onChange={(e) =>
                        handleExperienceChange(i, "designation", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.currently_working}
                        onChange={(e) =>
                          handleExperienceChange(
                            i,
                            "currently_working",
                            e.target.checked
                          )
                        }
                        className="mr-1"
                      />
                      <span className="text-sm">Current</span>
                    </label>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() =>
                        setExperiences(
                          experiences.filter((_, index) => index !== i)
                        )
                      }
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
                    <label className="text-sm font-medium text-gray-700">
                      Award
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={award.title || ""}
                      onChange={(e) =>
                        handleAwardChange(i, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-5 flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <select
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={award.year || ""}
                      onChange={(e) =>
                        handleAwardChange(i, "year", e.target.value)
                      }
                    >
                      <option value="">Select Year</option>
                      {generateYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() =>
                        setAwards(awards.filter((_, index) => index !== i))
                      }
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
                    <label className="text-sm font-medium text-gray-700">
                      Membership
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={membership || ""}
                      onChange={(e) =>
                        handleMembershipChange(i, e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() =>
                        setMemberships(
                          memberships.filter((_, index) => index !== i)
                        )
                      }
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
                <React.Fragment key={i}>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reg.registration_number || ""}
                      onChange={(e) =>
                        handleRegistrationChange(
                          i,
                          "registration_number",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reg.registration_date || ""}
                      onChange={(e) =>
                        handleRegistrationChange(
                          i,
                          "registration_date",
                          e.target.value
                        )
                      }
                      max="2025-07-30"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-3 text-cyan-500 px-4 py-2 rounded hover:bg-cyan-500 hover:text-white border border-cyan-500 transition cursor-pointer disabled:bg-gray-400"
              onClick={updateProfile}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfileForm;