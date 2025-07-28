import React, { useState, useEffect } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import axios from "axios";
import BASE_URL from "../../config";
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

const ProfileView = ({ userId }) => {
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

  const [activeTab, setActiveTab] = useState("Profile View");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/user/patient-profile`, {
          params: {
            id: userId,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = response.data.payload;
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
          referral_name: data.profileHarmonyHealthcare.referral_name || "",
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
  }, [userId]);

  if (isLoading) {
    return (
      <PatientLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-gray-600 text-lg">Loading profile data...</div>
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
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Profile Image
              </h3>
              <div className="flex items-center space-x-6">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <p className="text-gray-900">{form.prefix || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900">
                    {form.gender
                      ? form.gender.charAt(0).toUpperCase() +
                        form.gender.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900">{form.f_name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900">{form.l_name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">{form.DOB || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <p className="text-gray-900">{form.bio || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900">{form.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {form.phone_code} {form.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <p className="text-gray-900">{form.address_line1 || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <p className="text-gray-900">{form.address_line2 || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <p className="text-gray-900">{form.city || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <p className="text-gray-900">{form.state || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <p className="text-gray-900">{form.country || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Code
                  </label>
                  <p className="text-gray-900">{form.pin_code || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor's Name
                  </label>
                  <p className="text-gray-900">{form.doctor_name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor's Address
                  </label>
                  <p className="text-gray-900">
                    {form.doctor_address || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission to Contact Doctor
                  </label>
                  <p className="text-gray-900">
                    {form.permission_to_contact ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Referral Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Source
                  </label>
                  <p className="text-gray-900">
                    {form.referral_source || "N/A"}
                  </p>
                </div>
                {form.referral_source === "Friend/Referral" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Name
                    </label>
                    <p className="text-gray-900">
                      {form.referral_name || "N/A"}
                    </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injury Location
                  </label>
                  <p className="text-gray-900">
                    {form.injury_location || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Seeking Services
                  </label>
                  <p className="text-gray-900">
                    {form.reason_for_services || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Goals
                  </label>
                  <p className="text-gray-900">
                    {form.treatment_goals || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Duration
                  </label>
                  <p className="text-gray-900">
                    {form.problem_duration || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Had Similar Problem Before
                  </label>
                  <p className="text-gray-900">
                    {form.had_similar_problem ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Description
              </h3>
              <p className="text-gray-900">
                {form.pain_description.length > 0
                  ? form.pain_description.join(", ")
                  : "N/A"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Symptoms
              </h3>
              <p className="text-gray-900">
                {form.symptoms.length > 0 ? form.symptoms.join(", ") : "N/A"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Problem Status
              </h3>
              <p className="text-gray-900">
                {form.problem_status
                  ? form.problem_status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                    form.problem_status.replace("_", " ").slice(1)
                  : "N/A"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Triggers
              </h3>
              <p className="text-gray-900">
                {form.pain_triggers.length > 0
                  ? form.pain_triggers.join(", ")
                  : "N/A"}
              </p>
              {form.other_pain_trigger && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Pain Trigger
                  </label>
                  <p className="text-gray-900">{form.other_pain_trigger}</p>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Pain Interference
              </h3>
              <p className="text-gray-900">
                {form.pain_interference.length > 0
                  ? form.pain_interference.join(", ")
                  : "N/A"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Health Insurance
                  </label>
                  <p className="text-gray-900">
                    {form.insurance_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veterans Affairs Card Number
                  </label>
                  <p className="text-gray-900">
                    {form.veterans_card_number || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicare EPC Plan
                  </label>
                  <p className="text-gray-900">
                    {form.medicare_epc ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claiming through Worker's Compensation or CTP
                  </label>
                  <p className="text-gray-900">
                    {form.claim_through_worker_comp ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Medical History
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Work
                  </label>
                  <p className="text-gray-900">{form.type_of_work || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Health Professionals Seen
                  </label>
                  <p className="text-gray-900">
                    {form.other_health_professionals_seen || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <p className="text-gray-900">{form.medications || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ever Taken Cortisone or Prednisone
                  </label>
                  <p className="text-gray-900">
                    {form.ever_taken_cortisone ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pregnancy Status
                  </label>
                  <p className="text-gray-900">
                    {form.pregnancy_status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <p className="text-gray-900">
                    {[
                      form.high_blood_pressure && "High Blood Pressure",
                      form.cancer && "Cancer",
                      form.heart_problems && "Heart Problems",
                      form.diabetes && "Diabetes",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ProfileView;
