import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientLayout from "../../layouts/PatientLayout";
import BASE_URL from "../../config";
import InvoicePDF from "../common/invoicePdf";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Avtarimage from "../../images/avtarimage.webp";
import { getPrescriptions } from "../../services/prescriptionService";
import Scrolltop from "../common/Scrolltop";

const upperTabs = ["Appointments", "Prescriptions", "Medical Records", "Billing"];
const appointmentTabs = ["All", "Upcoming", "Today"];

const formatTimeToAMPM = (timeStr) => {
  if (!timeStr) return "..........";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export { formatTimeToAMPM, getStatusStyles };

const PatientDashboard = () => {
  const [activeUpperTab, setActiveUpperTab] = useState("Appointments");
  const [activeAppointmentTab, setActiveAppointmentTab] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [appointmentTotal, setAppointmentTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 10;
  const maxVisiblePages = 6;
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionTotal, setPrescriptionTotal] = useState(0);
  const [prescriptionPage, setPrescriptionPage] = useState(1);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || null;
  const token = localStorage.getItem("token");

  const BASE_SERVER_URL = BASE_URL.replace('/api', '');

 useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(['Item 1', 'Item 2', 'Item 3']);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (activeUpperTab === "Appointments") {
      fetchAppointments(appointmentPage);
    }

    if (activeUpperTab === "Billing") {
      fetchInvoices(invoicePage);
    }
  }, [activeUpperTab, appointmentPage, invoicePage, userId]);

  useEffect(() => {
    if (activeUpperTab === "Appointments" && userId) {
      setAppointmentPage(1);
      fetchAppointments(1);
    }
  }, [activeAppointmentTab]);

  useEffect(() => {
    if (activeUpperTab === "Prescriptions" && userId) {
      fetchPrescriptions(prescriptionPage);
    }
  }, [activeUpperTab, prescriptionPage, userId]);

  const fetchAppointments = async (page) => {
    if (!userId || !token) {
      setError("User not logged in.");
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const params = { limit, page, user_id: userId };
      if (activeAppointmentTab === "Upcoming") params.type = "upcoming";
      if (activeAppointmentTab === "Today") params.type = "today";

      const response = await axios.get(`${BASE_URL}/appointment/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const appts = response?.data?.payload?.data || [];
      const total = response?.data?.payload?.total || 0;
      setAppointmentTotal(total);

      const mapped = appts.map((a) => ({
        id: a.id,
        doctor_id: a.doctor_id,
        doctor:
          `${a?.doctor_prefix || ""} ${a.doctor_fname || ""} ${
            a.doctor_lname || ""
          }`.trim() || "Unknown",
        specialization: a.specializations?.[0]?.name || ".........",
        date: a.appointment_date
          ? new Date(a.appointment_date).toLocaleDateString()
          : "..........",
        time: formatTimeToAMPM(a.appointment_time),
        bookingDate: a.created_at
          ? new Date(a.created_at).toLocaleDateString()
          : "..........",
        amount: `${a.currency === "AUD" ? "AUD" : "AUD"} ${a.amount || 0}`,
        followUp: a.follow_up || "..........",
        status: a.status || "Pending",
        img:
          a.doctor_profile_image || Avtarimage,
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (page) => {
    if (!userId || !token) {
      setError("User not logged in.");
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/invoice/by-user?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response?.data?.payload?.data || [];
      const total = response?.data?.payload?.total || 0;
      setInvoiceTotal(total);

      const mapped = data.map((invoice) => ({
        id: invoice.id,
        invoiceNo: invoice.invoice_number || ".........",
        doctor: invoice.doctor_name || "Unknown",
        amount: `AUD ${invoice.total_amount || 0}`,
        paidOn: invoice.status || "",
        doctorImg:
          invoice.doctor_profile ||
          Avtarimage,
      }));

      setInvoices(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (page) => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const { data, total } = await getPrescriptions({
        page,
        limit,
        status: 1,
        prescribed_to: userId,
        token
      });
      setPrescriptions(data);
      setPrescriptionTotal(total);
    } catch (err) {
      setError("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(`${BASE_URL}/invoice/details/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.payload) {
        alert("Invoice data not found.");
        return;
      }

      setSelectedInvoice(res.data.payload);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching invoice details:", err);
      alert("Failed to fetch invoice details.");
    }
  };

  const renderPagination = (total, currentPage, setPage) => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const firstPages = [1, 2, 3];
      const lastPages = [totalPages - 2, totalPages - 1, totalPages];

      if (currentPage <= 3) {
        pageNumbers.push(...firstPages, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", ...lastPages);
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="cursor-pointer px-3 py-1 text-cyan-500 border border-cyan-500 bg-white hover:bg-cyan-500 hover:text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1 bg-cyan-500 text-white rounded text-sm">
          {currentPage}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="cursor-pointer px-3 py-1 text-cyan-500 border border-cyan-500 bg-white hover:bg-cyan-500 hover:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderAppointments = () => {
    if (!userId)
      return (
        <div className="p-4 text-red-500">
          Please log in to view appointments.
        </div>
      );
    if (loading)
      return (
        <div className="p-4 text-center">
          {loading ? <Loader /> : <div>Your actual page content</div>}
        </div>
      );
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
      <div>
        <div className="flex overflow-x-auto border-b mb-4 scrollbar-hide">
          {appointmentTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveAppointmentTab(tab)}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base font-medium ${
                activeAppointmentTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-xs sm:text-sm">
                <th className="p-3">Doctor</th>
                <th className="p-3">Appt Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Booking Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate("/doctor/profile", {
                            state: { doctor: { doctor_id: appt.doctor_id } },
                          })
                        }
                        className="flex items-center gap-2 text-left w-full p-3"
                      >
                        <img
                          src={appt.img || Avtarimage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Avtarimage;
                          }}
                          alt={appt.doctor}
                          className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                        <div className="cursor-pointer">{appt.doctor}</div>
                      </button>
                    </td>
                    <td className="p-3">{appt.date}</td>
                    <td className="p-3">{appt.time}</td>
                    <td className="p-3">{appt.bookingDate}</td>
                    <td className="p-3">{appt.amount}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full border ${getStatusStyles(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate("/patient/appointment/details", {
                            state: { id: appt.id },
                          })
                        }
                        className="cursor-pointer px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded shadow"
                      >
                        <i className="fa-solid fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {appointments.length > 0 &&
          renderPagination(
            appointmentTotal,
            appointmentPage,
            setAppointmentPage
          )}
      </div>
    );
  };

  const renderPrescriptions = () => {
    if (!userId)
      return <div className="p-4 text-red-500">Please log in to view prescriptions.</div>;
    if (loading) return <Loader />;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (prescriptions.length === 0)
      return <div className="p-4">No prescriptions available.</div>;

    // Helper to get first 10 words
    const getFirst10Words = (text) => {
      const words = text.split(' ');
      if (words.length <= 10) return text;
      return words.slice(0, 10).join(' ') + '...';
    };

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-xs sm:text-sm">
                <th className="p-3">Doctor</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Date</th>
                <th className="p-3">File</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => {
                const noteWords = p.notes ? p.notes.split(' ') : [];
                const isLong = noteWords.length > 10;
                const isExpanded = expandedNoteId === p.id;
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                    <td className="p-3 flex items-center gap-2">
                      <img src={p.doctor_profile_image ? BASE_URL + p.doctor_profile_image : Avtarimage}
                      onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Avtarimage;
                          }}
                       alt={p.doctor_name} className="w-8 h-8 rounded-full object-cover p-3" />
                      <span>{p.doctor_name}</span>
                    </td>
                    <td className="p-3">
                      {isLong && !isExpanded ? (
                        <>
                          {getFirst10Words(p.notes)}{' '}
                          <button
                            className="text-blue-500 underline cursor-pointer"
                            onClick={() => setExpandedNoteId(p.id)}
                          >
                            View
                          </button>
                        </>
                      ) : isLong && isExpanded ? (
                        <>
                          {p.notes}{' '}
                          <button
                            className="text-blue-500 underline cursor-pointer"
                            onClick={() => setExpandedNoteId(null)}
                          >
                            Hide
                          </button>
                        </>
                      ) : (
                        p.notes
                      )}
                    </td>
                    <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      {p.file_url ? (
                        <a href={BASE_SERVER_URL + p.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          Download
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {renderPagination(prescriptionTotal, prescriptionPage, setPrescriptionPage)}
      </div>
    );
  };

  const renderBilling = () => {
    if (!userId)
      return (
        <div className="p-4 text-red-500">
          Please log in to view billing information.
        </div>
      );
    if (loading) return <Loader />;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (invoices.length === 0)
      return <div className="p-4">No billing information available.</div>;

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-xs sm:text-sm">
                <th className="p-3">Invoice No</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={inv.doctorImg||Avtarimage}
                      onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Avtarimage;
                          }}
                      alt={inv.doctor}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div className="p-3">{inv.doctor}</div>
                  </td>
                  <td className="p-3">{inv.amount}</td>
                  <td className="p-3">{inv.paidOn}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewInvoice(inv.id)}
                      className="px-3 py-1 text-green-500 hover:bg-green-500 hover:text-white rounded shadow"
                    >
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(invoiceTotal, invoicePage, setInvoicePage)}
        {modalOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Invoice #{selectedInvoice.invoice_number}
              </h2>
              <InvoicePDF invoice={selectedInvoice} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeUpperTab) {
      case "Appointments":
        return renderAppointments();
      case "Prescriptions":
        return renderPrescriptions();
      case "Medical Records":
        return <div className="p-4">No medical records available.</div>;
      case "Billing":
        return renderBilling();
      default:
        return null;
    }
  };

  return (
    
    <PatientLayout>
      <Scrolltop/>
      <div className="p-3 sm:p-4">
        <div className="flex overflow-x-auto border-b mb-4 scrollbar-hide">
          {upperTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveUpperTab(tab);
                if (tab === "Appointments") {
                  setActiveAppointmentTab("All");
                  setAppointmentPage(1);
                }
                if (tab === "Billing") setInvoicePage(1);
                if (tab === "Prescriptions") setPrescriptionPage(1);
              }}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base cursor-pointer font-medium ${
                activeUpperTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white rounded shadow-sm">{renderTabContent()}</div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;