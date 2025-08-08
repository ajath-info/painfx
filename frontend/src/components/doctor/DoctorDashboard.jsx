import React, { useState, useEffect } from "react";
import {
  Eye,
  Check,
  X,
  Calendar,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DoctorLayout from "../../layouts/DoctorLayout";
import axios from "axios";
import BASE_URL from "../../config";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";
import avtarImage from "../../images/avtarimage.webp";

const IMAGE_BASE_URL = "http://localhost:5000";

ChartJS.register(ArcElement, Tooltip, Legend);

const formatProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return avtarImage;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${IMAGE_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

// Reschedule Modal Component
const RescheduleModal = ({ isOpen, onClose, appointment, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      onReschedule(appointment.id, selectedDate, selectedTime);
      onClose();
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDate("");
    setSelectedTime("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold cursor-pointer">
            Reschedule Appointment
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Rescheduling appointment for:{" "}
            <span className="font-medium">{appointment?.name}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
            Select Date
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
            Select Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select a time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime}
            className="cursor-pointer flex-1 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState({ Upcoming: [], Today: [] });
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const token = localStorage.getItem("token");
  const todayDate = new Date().toLocaleDateString("en-GB").replaceAll("/", "/");
  const navigate = useNavigate();

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "AUD",
    GBP: "£",
    AUD: "AUD",
    CAD: "$",
    JPY: "¥",
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const [upcomingRes, todayRes] = await Promise.all([
        axios.get(`${BASE_URL}/appointment`, {
          ...headers,
          params: { type: "upcoming" },
        }),
        axios.get(`${BASE_URL}/appointment`, {
          ...headers,
          params: { type: "today" },
        }),
      ]);

      const formatData = (data) =>
        data?.map((item) => ({
          id: item.id,
          name: `${item.patient_fname} ${item.patient_lname}`,
          date: new Date(item.appointment_date).toLocaleDateString(),
          time: new Date(
            `1970-01-01T${item.appointment_time}`
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          purpose: item.consultation_type
            ? item.consultation_type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())
            : "General",
          type:
            item.appointment_type === "paid" ? "New Patient" : "Old Patient",
          amount: `${currencySymbols[item.currency] || item.currency} ${
            item.amount
          }`,
          status: item.status,
          img: formatProfileImageUrl(item.patient_profile_image),
          userId: item.user_id,
          doctorId: item.doctor_id,
        })) || [];

      setAppointments({
        Upcoming: formatData(upcomingRes.data.payload.data),
        Today: formatData(todayRes.data.payload.data),
      });
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointment_id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/appointment/update`,
        {
          appointment_id,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  const handleReschedule = async (appointmentId, newDate, newTime) => {
    try {
      // You can add your reschedule API call here
      // For now, we'll just update the status to indicate it's been rescheduled
      await handleStatusUpdate(appointmentId, "rescheduled");

      // If you have a specific reschedule endpoint, use something like:
      // await axios.put(`${BASE_URL}/appointment/reschedule`, {
      //   appointment_id: appointmentId,
      //   new_date: newDate,
      //   new_time: newTime
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
    } catch (error) {
      console.error("Failed to reschedule appointment:", error);
    }
  };

  const openRescheduleModal = (appointment) => {
    setRescheduleAppointment(appointment);
    setIsRescheduleModalOpen(true);
    setDropdownOpen(null); // Close dropdown when opening modal
  };

  const toggleDropdown = (appointmentId) => {
    setDropdownOpen(dropdownOpen === appointmentId ? null : appointmentId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleAddPrescription = (appointment) => {
    navigate("/doctor/prescription", { state: { appointment: appointment } });
  };

  const handleClick = (appt) => {
    console.log("Selected appointment:", appt);
    console.log("Selected appointment user:", appt?.userId);
    navigate("/patient/profile-view", { state: { userId: appt.userId } });
  };

  const handleViewAppointment = (appt) => {
    navigate("/doctor/appointment/details", { state: { id: appt.id } });
  };

  // Function to render action buttons dropdown based on appointment status
  const renderActionDropdown = (appt) => {
    const handleAction = (action) => {
      setDropdownOpen(null); // Close dropdown first

      switch (action) {
        case "accept":
          handleStatusUpdate(appt.id, "confirmed");
          break;
        case "cancel":
          handleStatusUpdate(appt.id, "cancelled");
          break;
        case "reschedule":
          openRescheduleModal(appt);
          break;
        case "complete":
          handleStatusUpdate(appt.id, "completed");
          break;
        default:
          break;
      }
    };

    const getAvailableActions = () => {
      switch (appt.status) {
        case "pending":
          return [
            {
              action: "accept",
              label: "Accept",
              icon: <Check size={14} />,
              color: "text-green-600 hover:bg-green-50",
            },
            {
              action: "cancel",
              label: "Cancel",
              icon: <X size={14} />,
              color: "text-red-600 hover:bg-red-50",
            },
            {
              action: "reschedule",
              label: "Reschedule",
              icon: <Calendar size={14} />,
              color: "text-blue-600 hover:bg-blue-50",
            },
            {
              action: "complete",
              label: "Complete",
              icon: <Check size={14} />,
              color: "text-purple-600 hover:bg-purple-50",
            },
          ];
        case "confirmed":
          return [
            {
              action: "cancel",
              label: "Cancel",
              icon: <X size={14} />,
              color: "text-red-600 hover:bg-red-50",
            },
            {
              action: "reschedule",
              label: "Reschedule",
              icon: <Calendar size={14} />,
              color: "text-blue-600 hover:bg-blue-50",
            },
            {
              action: "complete",
              label: "Complete",
              icon: <Check size={14} />,
              color: "text-purple-600 hover:bg-purple-50",
            },
          ];
        case "rescheduled":
          return [
            {
              action: "cancel",
              label: "Cancel",
              icon: <X size={14} />,
              color: "text-red-600 hover:bg-red-50",
            },
            {
              action: "reschedule",
              label: "Reschedule",
              icon: <Calendar size={14} />,
              color: "text-blue-600 hover:bg-blue-50",
            },
            {
              action: "complete",
              label: "Complete",
              icon: <Check size={14} />,
              color: "text-purple-600 hover:bg-purple-50",
            },
          ];
        case "cancelled":
        case "completed":
          return [];
        default:
          return [
            {
              action: "accept",
              label: "Accept",
              icon: <Check size={14} />,
              color: "text-green-600 hover:bg-green-50",
            },
            {
              action: "cancel",
              label: "Cancel",
              icon: <X size={14} />,
              color: "text-red-600 hover:bg-red-50",
            },
            {
              action: "reschedule",
              label: "Reschedule",
              icon: <Calendar size={14} />,
              color: "text-blue-600 hover:bg-blue-50",
            },
            {
              action: "complete",
              label: "Complete",
              icon: <Check size={14} />,
              color: "text-purple-600 hover:bg-purple-50",
            },
          ];
      }
    };

    const availableActions = getAvailableActions();

    // If no actions available, show status
    if (availableActions.length === 0) {
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
            appt.status === "cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {appt.status === "cancelled" ? "Cancelled" : "Completed"}
        </span>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(appt.id);
          }}
          className=" border border-cyan-500 flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
        >
          <span className="text-cyan-500">{appt.status}</span>
          <ChevronDown size={14} className="text-cyan-500" />
        </button>

        <div className="relative">
          {/* Your button here */}

          {dropdownOpen === appt.id && (
            <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                {availableActions.map(({ action, label, icon, color }) => (
                  <button
                    key={action}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${color} flex items-center space-x-2`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.Today.length + appointments.Upcoming.length,
      color: "#ec4899",
    },
    {
      label: "Today Appointments",
      value: appointments.Today.length,
      color: "#10b981",
    },
    {
      label: "Upcoming Appointments",
      value: appointments.Upcoming.length,
      color: "#3b82f6",
    },
  ];

  const chartOptions = {
    cutout: "70%",
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const generateChartData = (percentage, color) => ({
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  });

  const filteredAppointments = appointments[activeTab] || [];

  return (
    <>
      {loading && <Loader />}
      <DoctorLayout>
        <div className="min-h-screen bg-gray-100">
          <main className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow flex items-center p-4"
                >
                  <div className="w-24 h-24">
                    <Doughnut
                      data={generateChartData(
                        Math.min(item.value / 20, 100),
                        item.color
                      )}
                      options={chartOptions}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">{item.label}</h4>
                    <p className="text-2xl font-bold text-black">
                      {item.value}
                    </p>
                    <p className="text-lg text-gray-500">
                      {item.label === "Total Appointments"
                        ? "Till Today"
                        : todayDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-8">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab("Upcoming")}
                  className={`rounded-full px-4 py-2 ${
                    activeTab === "Upcoming"
                      ? "bg-cyan-500 cursor-pointer text-white"
                      : "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white cursor-pointer"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("Today")}
                  className={`rounded-full px-4 py-2 ${
                    activeTab === "Today"
                      ? "bg-cyan-500 cursor-pointer text-white"
                      : "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white cursor-pointer"
                  }`}
                >
                  Today
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <Loader />
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Appt Date</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Paid Amount</th>
                        <th className="p-3">Actions</th>
                        <th className="p-3">Add Prescription</th>
                        <th className="p-3">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-gray-50">
                            <td
                              className="p-3 flex items-center space-x-3 cursor-pointer"
                              onClick={() => handleClick(appt)}
                            >
                              <img
                                src={appt.img}
                                alt={appt.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="p-3">{appt.name}</span>
                            </td>
                            <td className="p-3">
                              {appt.date}
                              <div className="text-blue-500 text-xs">
                                {appt.time}
                              </div>
                            </td>
                            <td className="p-3">{appt.purpose}</td>
                            <td className="p-3">{appt.amount}</td>
                            <td className="p-3">
                              {renderActionDropdown(appt)}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleAddPrescription(appt)}
                                className="px-2 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center space-x-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span>Add Prescription</span>
                              </button>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleViewAppointment(appt)}
                                className="cursor-pointer px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded shadow flex items-center space-x-1"
                              >
                                <Eye size={16} />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center p-4 text-gray-500"
                          >
                            No appointments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </DoctorLayout>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={rescheduleAppointment}
        onReschedule={handleReschedule}
      />
    </>
  );
};

export default DoctorDashboard;
