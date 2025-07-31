import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config";
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Activity, FileText, Users, Clock, Award } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
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
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all duration-500 z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

const ProfileCard = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
    <div className="bg-gray-400 p-4">
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-white" />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoItem = ({ label, value, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <p className="text-gray-900 font-medium">{value || "N/A"}</p>
  </div>
);

const BadgeInfo = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800"
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
        {value || "N/A"}
      </span>
    </div>
  );
};

const ProfileView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

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
    id: "",
    user_name: "",
    status: "",
    is_approved: false,
    last_login: "",
    last_ip: "",
    role: "",
    consultation_fee_type: "",
    consultation_fee: "",
    created_at: "",
    profile_id: "",
    user_id: "",
    profile_updated_at: ""
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
    if (!userId) {
      setToast({
        isVisible: true,
        message: "No user ID provided. Redirecting...",
        type: "error",
      });
      setTimeout(() => navigate("/not-found"), 3000);
      return;
    }

    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${BASE_URL}/user/patient-profile?id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          const data = response.data.payload;
          const parsedData = {
            id: data.patient.id || "",
            prefix: data.patient.prefix || "",
            f_name: data.patient.f_name || "",
            l_name: data.patient.l_name || "",
            email: data.patient.email || "",
            phone: data.patient.phone || "",
            phone_code: data.patient.phone_code || "+61",
            DOB: data.patient.DOB
              ? new Date(data.patient.DOB).toLocaleString()
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
            status: data.patient.status || "",
            is_approved: !!data.patient.is_approved,
            user_name: data.patient.user_name || "",
            last_login: data.patient.last_login || "",
            last_ip: data.patient.last_ip || "",
            role: data.patient.role || "",
            consultation_fee_type: data.patient.consultation_fee_type || "",
            consultation_fee: data.patient.consultation_fee || "",
            created_at: data.patient.created_at ? new Date(data.patient.created_at).toLocaleString() : "",
            profile_id: data.profile.profile_id || "",
            user_id: data.profile.user_id || "",
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
            profile_updated_at: data.profile.profile_updated_at ? new Date(data.profile.profile_updated_at).toLocaleString() : ""
          };

          setForm(parsedData);
          if (data.patient.profile_image) {
            const imageUrl = data.patient.profile_image.startsWith("http")
              ? data.patient.profile_image
              : `${IMAGE_BASE_URL}${data.patient.profile_image.startsWith("/") ? "" : "/"}${data.patient.profile_image}`;
            setPreviewImage(imageUrl);
          }

          // setToast({
          //   isVisible: true,
          //   message: "Profile data loaded successfully",
          //   type: "success",
          // });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching profile data:", error);
          if (error.response?.status === 404) {
            setToast({
              isVisible: true,
              message: "Patient not found. Redirecting...",
              type: "error",
            });
            // setTimeout(() => navigate("/not-found"), 3000);
          } else {
            setToast({
              isVisible: true,
              message: "Failed to load profile data. Please try again.",
              type: "error",
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId, navigate]);

  if (isLoading) {
    return (
      <>
      <Header />
        <div className="min-h-screen bg-gray-400 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg"><Loader/></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Header />
      <div className="min-h-screen bg-gray-50">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          setToast={setToast}
        />
        
        <div className="bg-cyan-500 text-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Patient Profile</h1>
                <p className="mt-1">Comprehensive patient information and medical details</p>
              </div>
              <button
                className="cursor-pointer border border-white bg-white text-cyan-500 px-6 py-2 rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-200 shadow-lg"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-400 px-6 py-8">
                <div className="flex items-center space-x-6">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center shadow-lg">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="text-white">
                    <h2 className="text-3xl font-bold">
                      {`${form.prefix} ${form.f_name} ${form.l_name}`.trim() || "N/A"}
                    </h2>
                    <p className="text-blue-100 text-lg mt-1">{form.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfileCard title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Date of Birth" value={form.DOB} />
                  <InfoItem label="Gender" value={form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1) : "N/A"} />
                  <div className="md:col-span-2">
                    <InfoItem label="Bio" value={form.bio} />
                  </div>
                </div>
              </ProfileCard>

              <ProfileCard title="Contact Information" icon={Mail}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900 font-medium">{`${form.phone_code} ${form.phone}` || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900 font-medium">{form.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </ProfileCard>
            </div>

            <ProfileCard title="Address Information" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <InfoItem label="Address Line 1" value={form.address_line1} />
                </div>
                <InfoItem label="Address Line 2" value={form.address_line2} />
                <InfoItem label="City" value={form.city} />
                <InfoItem label="State" value={form.state} />
                <InfoItem label="Country" value={form.country} />
                <InfoItem label="Postal Code" value={form.pin_code} />
              </div>
            </ProfileCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfileCard title="Medical Information" icon={Heart}>
                <div className="space-y-4">
                  <InfoItem label="Doctor's Name" value={form.doctor_name} />
                  <InfoItem label="Doctor's Address" value={form.doctor_address} />
                  <InfoItem label="Injury Location" value={form.injury_location} />
                  <InfoItem label="Reason for Services" value={form.reason_for_services} />
                  <InfoItem label="Treatment Goals" value={form.treatment_goals} />
                  <InfoItem label="Problem Duration" value={form.problem_duration} />
                  <BadgeInfo 
                    label="Problem Status" 
                    value={form.problem_status ? form.problem_status.replace("_", " ").charAt(0).toUpperCase() + form.problem_status.replace("_", " ").slice(1) : "N/A"}
                    color={form.problem_status === "getting_better" ? "green" : form.problem_status === "getting_worse" ? "red" : "yellow"}
                  />
                </div>
              </ProfileCard>

              <ProfileCard title="Insurance & Benefits" icon={Shield}>
                <div className="space-y-4">
                  <InfoItem label="Insurance Name" value={form.insurance_name} />
                  <InfoItem label="Veterans Card Number" value={form.veterans_card_number} />
                  <BadgeInfo label="Medicare EPC Plan" value={form.medicare_epc ? "Yes" : "No"} color={form.medicare_epc ? "green" : "red"} />
                  <BadgeInfo label="Worker's Compensation" value={form.claim_through_worker_comp ? "Yes" : "No"} color={form.claim_through_worker_comp ? "green" : "red"} />
                  <InfoItem label="Type of Work" value={form.type_of_work} />
                </div>
              </ProfileCard>
            </div>

            <ProfileCard title="Symptoms & Pain Information" icon={Activity}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Pain Description</label>
                    <div className="flex flex-wrap gap-2">
                      {form.pain_description.length > 0 ? (
                        form.pain_description.map((pain, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {pain}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Symptoms</label>
                    <div className="flex flex-wrap gap-2">
                      {form.symptoms.length > 0 ? (
                        form.symptoms.map((symptom, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            {symptom}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Pain Triggers</label>
                    <div className="flex flex-wrap gap-2">
                      {form.pain_triggers.length > 0 ? (
                        form.pain_triggers.map((trigger, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {trigger}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Pain Interference</label>
                    <div className="flex flex-wrap gap-2">
                      {form.pain_interference.length > 0 ? (
                        form.pain_interference.map((interference, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {interference}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <BadgeInfo label="Similar Problem Before" value={form.had_similar_problem ? "Yes" : "No"} color={form.had_similar_problem ? "red" : "green"} />
                <InfoItem label="Other Pain Trigger" value={form.other_pain_trigger} />
              </div>
            </ProfileCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfileCard title="Health Conditions" icon={Heart}>
                <div className="grid grid-cols-2 gap-4">
                  <BadgeInfo label="High Blood Pressure" value={form.high_blood_pressure ? "Yes" : "No"} color={form.high_blood_pressure ? "red" : "green"} />
                  <BadgeInfo label="Cancer" value={form.cancer ? "Yes" : "No"} color={form.cancer ? "red" : "green"} />
                  <BadgeInfo label="Heart Problems" value={form.heart_problems ? "Yes" : "No"} color={form.heart_problems ? "red" : "green"} />
                  <BadgeInfo label="Diabetes" value={form.diabetes ? "Yes" : "No"} color={form.diabetes ? "red" : "green"} />
                  <BadgeInfo label="Taken Cortisone" value={form.ever_taken_cortisone ? "Yes" : "No"} color={form.ever_taken_cortisone ? "yellow" : "green"} />
                  <BadgeInfo label="Pregnancy Status" value={form.pregnancy_status.toUpperCase()} color="purple" />
                </div>
              </ProfileCard>

              <ProfileCard title="Treatment & Referrals" icon={Users}>
                <div className="space-y-4">
                  <InfoItem label="Referral Source" value={form.referral_source} />
                  {form.referral_source === "Friend/Referral" && (
                    <InfoItem label="Referral Name" value={form.referral_name} />
                  )}
                  <InfoItem label="Other Health Professionals Seen" value={form.other_health_professionals_seen} />
                  <InfoItem label="Medications" value={form.medications} />
                  <BadgeInfo label="Permission to Contact Doctor" value={form.permission_to_contact ? "Yes" : "No"} color={form.permission_to_contact ? "green" : "red"} />
                </div>
              </ProfileCard>
            </div>

            <ProfileCard title="System Information" icon={Clock}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem label="Joined at" value={form.created_at} />
                <BadgeInfo label="Account Status" value={form.status === "1" ?"Active":"Inactive"} color="blue" />
              </div>
            </ProfileCard>
          </div>
        </div>
      </div>
    <Footer />
    </>
  );
};

export default ProfileView;