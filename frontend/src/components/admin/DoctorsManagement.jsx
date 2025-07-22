import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import debounce from "lodash.debounce";
import BASE_URL from "../../config";
import Loader from "../common/Loader";

const token = localStorage.getItem("token");

function DoctorProfileForm({ mode = "add", doctorId = null, onCancel, onSaved }) {
  const [services, setServices] = useState(["Tooth cleaning"]);
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [educations, setEducations] = useState([{ degree: "", college: "", year: "" }]);
  const [experiences, setExperiences] = useState([{ hospital: "", from: "", to: "", designation: "" }]);
  const [awards, setAwards] = useState([{ award: "", year: "" }]);
  const [memberships, setMemberships] = useState([""]);
  const [registrations, setRegistrations] = useState([{ registration: "", year: "" }]);
  const [clinics, setClinics] = useState([]);
  const [availableClinics, setAvailableClinics] = useState([]);
  const [newClinic, setNewClinic] = useState({
    name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
  });
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
    email: "",
    password: "", // Added password field
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState("");

  // Fetch user role from token
  const getUserRole = () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Basic JWT decoding
      return decoded.role;
    } catch (e) {
      return null;
    }
  };

  const searchSpecializations = useCallback(
    debounce(async (query) => {
      try {
        if (!token) {
          setMessage("Authentication token not found. Please login again.");
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
        setMessage(
          `Error searching specializations: ${err.response?.data?.message || err.message}`
        );
        setAvailableSpecializations([]);
      }
    }, 500),
    [allSpecializations]
  );

  const fetchClinicDetails = async (clinicId) => {
    try {
      const response = await axios.get(`${BASE_URL}/clinic/get/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 1) {
        setClinics([response.data.payload]); // Set the selected clinic data
      } else {
        setMessage("Error fetching clinic details.");
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
          setMessage("Authentication token not found. Please login again.");
          setIsLoading(false);
          return;
        }

        const role = getUserRole();
        if (role === "admin") {
          const clinicsRes = await axios.get(`${BASE_URL}/clinic/search-active-clinics`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (clinicsRes.data.status === 1) {
            setAvailableClinics(clinicsRes.data.payload || []); // Store available clinics for dropdown
            setClinics([]); // Keep clinics empty until selected
          }
        } else if (role === "clinic") {
          const clinicRes = await axios.get(`${BASE_URL}/clinic/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (clinicRes.data.status === 1) {
            setClinics([]); // Initialize empty
            setSelectedClinicId(clinicRes.data.payload.id || "");
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

        if (mode === "edit" && doctorId) {
          await loadDoctorProfile(doctorId);
        } else {
          setIsLoading(false);
        }
        setMessage("");
      } catch (err) {
        setMessage(
          `Error fetching initial data: ${err.response?.data?.message || err.message}`
        );
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
    if (selectedClinicId && getUserRole() === "admin") {
      fetchClinicDetails(selectedClinicId);
    }
  }, [selectedClinicId]);

  const loadDoctorProfile = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/doctor-profile?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.payload || {};
      setProfile((prev) => ({
        ...prev,
        prefix: data.prefix || prev.prefix,
        f_name: data.f_name || "",
        l_name: data.l_name || "",
        phone: data.phone || "",
        phone_code: data.phone_code || prev.phone_code,
        DOB: data.DOB || "",
        gender: data.gender || "male",
        bio: data.bio || "",
        address_line1: data.address_line1 || "",
        address_line2: data.address_line2 || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pin_code: data.pin_code || "",
        consultation_fee_type: data.consultation_fee && data.consultation_fee > 0 ? "paid" : "free",
        consultation_fee: data.consultation_fee || 0,
        email: data.email || "",
        password: "", // Password is not fetched for edit mode, left blank
      }));
      if (data.profile_image_url) setPreviewImage(data.profile_image_url);
      if (Array.isArray(data.services) && data.services.length) setServices(data.services);
      if (Array.isArray(data.specializations)) setSpecializations(data.specializations.map((s) => s.id));
      if (Array.isArray(data.educations) && data.educations.length)
        setEducations(
          data.educations.map((e) => ({
            degree: e.degree || "",
            college: e.institution || "",
            year: e.year_of_passing ? String(e.year_of_passing) : "",
          }))
        );
      if (Array.isArray(data.experiences) && data.experiences.length)
        setExperiences(
          data.experiences.map((x) => ({
            hospital: x.hospital || "",
            from: x.start_date || "",
            to: x.end_date || "",
            designation: x.designation || "",
          }))
        );
      if (Array.isArray(data.awards) && data.awards.length)
        setAwards(
          data.awards.map((a) => ({
            award: a.title || "",
            year: a.year ? String(a.year) : "",
          }))
        );
      if (Array.isArray(data.memberships) && data.memberships.length)
        setMemberships(data.memberships.map((m) => m.text || ""));
      if (data.registration_number)
        setRegistrations([{ registration: data.registration_number, year: data.registration_date || "" }]);
      if (Array.isArray(data.clinics) && data.clinics.length > 0) {
        setSelectedClinicId(data.clinics[0].id || "");
        await fetchClinicDetails(data.clinics[0].id);
      }
      setIsLoading(false);
    } catch (err) {
      setMessage(
        `Error loading doctor profile: ${err.response?.data?.message || err.message}`
      );
      setIsLoading(false);
    }
  };

  const addEducation = () => {
    setEducations([...educations, { degree: "", college: "", year: "" }]);
  };

  const deleteEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperiences([...experiences, { hospital: "", from: "", to: "", designation: "" }]);
  };

  const addAward = () => setAwards([...awards, { award: "", year: "" }]);

  const addMembership = () => setMemberships([...memberships, ""]);

  const addClinic = () => {
    if (newClinic.name && newClinic.address_line1) {
      setClinics([...clinics, { ...newClinic, created_by_role: "doctor" }]);
      setNewClinic({
        name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "",
        pin_code: "",
      });
    } else {
      setMessage("Error: Clinic name and address line 1 are required.");
    }
  };

  const deleteClinic = (index) => {
    setClinics(
      clinics.map((clinic, i) =>
        i === index ? { ...clinic, remove: true } : clinic
      )
    );
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    if (field === "year" && value && !/^\d{4}$/.test(value)) {
      setMessage("Error: Year must be a valid 4-digit number.");
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
    if (field === "year" && value && !/^\d{4}$/.test(value)) {
      setMessage("Error: Year must be a valid 4-digit number.");
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
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setMessage("Error: Only JPG, PNG or GIF files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Error: File size must be less than 2MB.");
      return;
    }
    setProfile((prev) => ({ ...prev, profile_image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setIsLoading(true);
    setMessage("");
    if (!profile.f_name || !profile.l_name || !profile.email || !profile.password) { // Added password to validation
      setMessage("Error: First Name, Last Name, Email, and Password are required.");
      setIsLoading(false);
      return;
    }
    try {
      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }
      const data = new FormData();
      if (profile.profile_image) data.append("image", profile.profile_image);

      // Construct payload based on the specified structure
      const payload = {
        email: mode === "add" ? profile.email : undefined, // Only for add mode
        password: mode === "add" ? profile.password : undefined, // Only for add mode
        f_name: profile.f_name,
        l_name: profile.l_name,
        phone: profile.phone,
        phone_code: profile.phone_code,
        prefix: profile.prefix,
        DOB: profile.DOB,
        gender: profile.gender,
        bio: profile.bio,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        pin_code: profile.pin_code,
        consultation_fee_type: profile.consultation_fee_type,
        consultation_fee: profile.consultation_fee_type === "paid" ? profile.consultation_fee : 0,
        clinic_ids: getUserRole() === "admin" && selectedClinicId ? [parseInt(selectedClinicId)] : undefined, // Only for admin
        services,
        specializations,
        educations: educations
          .map((edu) => ({
            degree: edu.degree || "",
            institution: edu.college || "",
            year_of_passing: parseInt(edu.year) || null,
          }))
          .filter((edu) => edu.degree && edu.institution),
        experiences: experiences
          .map((exp) => ({
            hospital: exp.hospital || "",
            start_date: exp.from || "",
            end_date: exp.to || "",
            currently_working: !exp.to,
            designation: exp.designation || "",
          }))
          .filter((exp) => exp.hospital && exp.start_date),
        awards: awards
          .map((award) => ({
            title: award.award || "",
            year: parseInt(award.year) || null,
          }))
          .filter((award) => award.title),
        memberships: memberships
          .map((m) => ({ text: m || "" }))
          .filter((m) => m.text),
        registration:
          registrations.length > 0 && registrations[0].registration
            ? {
                registration_number: registrations[0].registration || "",
                registration_date: registrations[0].year || "",
              }
            : null,
      };

      data.append("data", JSON.stringify(payload));

      const endpoint = `${BASE_URL}/doctor/add-or-update`; // New add doctor API
      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(
        mode === "edit"
          ? "Doctor profile updated successfully!"
          : "Doctor profile created successfully!"
      );
      if (onSaved) onSaved();
      return true;
    } catch (error) {
      setMessage(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Failed to save profile"
        }`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSpecialization = (id) => {
    setSpecializations(specializations.filter((specId) => specId !== id));
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-10">
        <Loader />
      </div>
    );
  }

  return (
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
            <button onClick={() => setMessage("")} className="text-lg font-bold">
              ×
            </button>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Basic Information</h4>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
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
                <p className="text-xs text-gray-500">
                  Allowed JPG, GIF or PNG. Max size of 2MB
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium text-gray-700">
                Clinic:
              </label>
              {getUserRole() === "admin" && (
                <select
                  className="w-80 mr-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClinicId || ""}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                >
                  <option value="">Select Clinic</option>
                  {availableClinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
              {getUserRole() === "clinic" && (
                <span className="text-sm">{clinics[0]?.name || "N/A"}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Email", field: "email", required: true },
              { label: "Password", field: "password", required: true, type: "password" }, // Added password field
              { label: "First Name", field: "f_name", required: true },
              { label: "Last Name", field: "l_name", required: true },
              { label: "Phone Number", field: "phone" },
              { label: "Gender", field: "gender", type: "select" },
              { label: "Date of Birth", field: "DOB", type: "date" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  {item.label}{" "}
                  {item.required && <span className="text-red-500">*</span>}
                </label>
                {item.type === "select" ? (
                  <select
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={profile[item.field] || ""}
                    onChange={(e) =>
                      handleProfileChange(item.field, e.target.value)
                    }
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
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">About Me</h4>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Biography</label>
            <textarea
              className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              value={profile.bio || ""}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Clinic Info</h4>
          {clinics.length > 0 &&
            clinics.map(
              (clinic, i) =>
                !clinic.remove && (
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
                            className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={clinic[item.field] || ""}
                            onChange={(e) =>
                              handleClinicChange(i, item.field, e.target.value)
                            }
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
                  </div>
                )
            )}
          {/* <div className="mt-6"> */}
            {/* <h5 className="text-lg font-semibold mb-4">Add New Clinic</h5> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Clinic Name", field: "name" },
                { label: "Address Line 1", field: "address_line1" },
                { label: "Address Line 2", field: "address_line2" },
                { label: "City", field: "city" },
                { label: "State", field: "state" },
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
                    value={newClinic[item.field] || ""}
                    onChange={(e) =>
                      setNewClinic({
                        ...newClinic,
                        [item.field]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <div className="col-span-2">
                <button
                  className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={addClinic}
                >
                  Add Clinic
                </button>
              </div>
            </div> */}
          {/* </div> */}
        </div>

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

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Pricing</h4>
          <div className="flex gap-4 mb-4 flex-wrap">
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
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                value={profile.consultation_fee || ""}
                onChange={(e) =>
                  handleProfileChange(
                    "consultation_fee",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="20"
              />
              <p className="text-xs text-gray-500 mt-1">
                Custom price you can add
              </p>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Services and Specialization</h4>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium text-gray-700">Services</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Services"
              value={services.join(", ") || ""}
              onChange={(e) =>
                setServices(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s)
                )
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Type & Press enter to add new services
            </p>
            {services.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No services assigned. Add services above.
              </p>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium text-gray-700">
              Search Specializations
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
                  onClick={() => setSearchQuery("")}
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
              Select Specializations
            </label>
            <select
              multiple
              className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={specializations}
              onChange={(e) => {
                const selectedIds = Array.from(
                  e.target.selectedOptions,
                  (option) => parseInt(option.value)
                );
                setSpecializations([
                  ...new Set([...specializations, ...selectedIds]),
                ]);
              }}
            >
              {Array.isArray(availableSpecializations) &&
              availableSpecializations.length > 0 ? (
                availableSpecializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name || "Unknown"}
                  </option>
                ))
              ) : (
                <option disabled>No specializations available</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple specializations
            </p>
          </div>
          {Array.isArray(allSpecializations) && specializations.length > 0 && (
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
                    );
                    return (
                      <tr key={specializationId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {spec ? spec.name : "Unknown"}
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

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Education</h4>
          <div className="space-y-4">
            {educations.map((edu, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Degree</label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={edu.degree || ""}
                    onChange={(e) => handleEducationChange(i, "degree", e.target.value)}
                  />
                </div>
                <div className="md:col-span-4 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    College/Institute
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={edu.college || ""}
                    onChange={(e) => handleEducationChange(i, "college", e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Year of Completion
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={edu.year || ""}
                    onChange={(e) => handleEducationChange(i, "year", e.target.value)}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  {i > 0 && (
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => deleteEducation(i)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
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

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Experience</h4>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
                    value={exp.from || ""}
                    onChange={(e) =>
                      handleExperienceChange(i, "from", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-3 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    To
                  </label>
                  <input
                    type="date"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={exp.to || ""}
                    onChange={(e) =>
                      handleExperienceChange(i, "to", e.target.value)
                    }
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
                <div className="md:col-span-1 flex items-end">
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
                    value={award.award || ""}
                    onChange={(e) =>
                      handleAwardChange(i, "award", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={award.year || ""}
                    onChange={(e) =>
                      handleAwardChange(i, "year", e.target.value)
                    }
                  />
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
                    onChange={(e) => handleMembershipChange(i, e.target.value)}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() =>
                      setMemberships(memberships.filter((_, index) => index !== i))
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

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Registrations</h4>
          {registrations.slice(0, 1).map((reg, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={reg.registration || ""}
                    onChange={(e) =>
                      handleRegistrationChange(i, "registration", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={reg.year || ""}
                    onChange={(e) =>
                      handleRegistrationChange(i, "year", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              className="p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            onClick={saveProfile}
            disabled={isLoading}
          >
            {isLoading
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update Doctor Profile"
              : "Create Doctor Profile"}
          </button>
        </div>
      </div>
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
          doc.specializations?.map((s) => s.name).join(", ") || "..........",
        avatar: doc.profile_image || "https://via.placeholder.com/40",
        memberSince: new Date(doc.created_at).toLocaleDateString(),
        earned: `$ ${doc.earning || "0.00"}`,
        status: doc.status === "1",
      }));
      setDoctorData(formattedDoctors);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const doctor = doctorData.find((doc) => doc.id === id);
      if (!doctor) return;
      const newStatus = !doctor.status ? "1" : "2";
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
      console.error("Failed to update status:", err);
    }
  };

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm("Delete this doctor?");
    if (!confirmDelete) return;
    try {
      setIsBusy(true);
      await axios.delete(`${BASE_URL}/user/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id: id },
      });
      setDoctorData((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete doctor:", err);
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
                {editingDoctorId ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <p className="text-gray-600">
                Dashboard / Users / Doctor / {editingDoctorId ? "Edit" : "Add"}
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
            mode={editingDoctorId ? "edit" : "add"}
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
              Showing {startIndex + 1} to {Math.min(endIndex, doctorData.length)} of{" "}
              {doctorData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DoctorsManagement;