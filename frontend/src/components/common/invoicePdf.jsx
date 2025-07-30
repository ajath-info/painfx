import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../images/logo-white.webp";
import {
  FileText,
  Download,
  Calendar,
  User,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

const InvoicePDF = ({ invoice }) => {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
  const input = invoiceRef.current;
  if (!input) return;

  // Wait to ensure DOM updates
  await new Promise((r) => setTimeout(r, 300));

  try {
    // Create a temporary printable area
    const printContents = input.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } catch (error) {
    console.error("Print failed:", error);
    alert("Failed to print. Please check your styles and try again.");
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Invalid time";
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return "N/A";
    try {
      const date = new Date(dateString);
      const [hours, minutes] = timeString.split(":");
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Invalid date or time";
    }
  };

  const formatAddress = () => {
    const parts = [
      invoice?.patient_address1,
      invoice?.patient_address2,
      invoice?.patient_city,
      invoice?.patient_state,
      invoice?.patient_country,
      invoice?.patient_pin_code,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#f9fafb",
        minHeight: "10vh",
        padding: "16px",
      }}
    >
      {/* Download Button */}
    <div
      style={{
        width: '100%',
        backgroundColor: '#f9fafb',
        minHeight: '10vh',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between', // ✅ left and right
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        {/* Download Button on the left */}
        <button
          onClick={downloadPDF}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '6px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Download size={18} /> Download PDF
        </button>

        {/* Logo on the right */}
        <img
          src={logo}
          alt="Logo"
          style={{ height: '40px', objectFit: 'contain' }}
        />
      </div>
    </div>
      

      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        style={{
          backgroundColor: "white",
          maxWidth: "768px",
          margin: "0 auto",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflowY: "auto",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
            marginBottom: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileText size={24} /> Invoice
          </h1>
          
          <span style={{ fontSize: "14px", color: "#4b5563" }}>
            Invoice No: <strong>{invoice?.invoice_number || "N/A"}</strong>
          </span>
        </div>

        {/* Patient and Provider Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Billed To */}
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <User size={18} /> Billed To
            </h2>
            <p>{invoice?.patient_name || "N/A"}</p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              <Mail size={14} style={{ marginRight: "6px", flexShrink: 0 }} />{" "}
              {invoice?.patient_email || "N/A"}
            </span>
            <br />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              <Phone size={14} style={{ marginRight: "6px", flexShrink: 0 }} />{" "}
              {invoice?.patient_phone || "N/A"}
            </span>
            <br />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              <MapPin size={14} style={{ marginRight: "6px", flexShrink: 0 }} />{" "}
              {formatAddress()}
            </span>
          </div>

          {/* Provider */}
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Stethoscope size={18} /> Provider
            </h2>
            <p>{invoice?.doctor_name || "N/A"}</p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              <Mail size={14} style={{ marginRight: "6px", flexShrink: 0 }} />{" "}
              {invoice?.doctor_email || "N/A"}
            </span>
            <br />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              <Phone size={14} style={{ marginRight: "6px", flexShrink: 0 }} />{" "}
              {invoice?.doctor_phone || "N/A"}
            </span>
          </div>
        </div>

        {/* Appointment Info */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Calendar size={18} /> Appointment Details
          </h2>
          <p
            style={{
              margin: "6px",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#1f2937",
            }}
          >
            <Clock size={14} style={{ marginRight: "6px" }} />
            {formatDateTime(
              invoice?.appointment_date,
              invoice?.appointment_time
            )}
          </p>
          <p style={{ fontSize: "14px", color: "#374151", marginTop: "4px" }}>
            Type: {(invoice?.consultation_type || "N/A").replace(/_/g, " ")}
          </p>
        </div>

        {/* Charges */}
        <div style={{ overflowX: "auto", marginBottom: "24px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #d1d5db",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f3f4f6",
                  fontWeight: "600",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>
                  Description
                </th>
                <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>
                  Consultation Fee
                </td>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>
                  AUD {invoice?.appointment_amount || "0.00"}
                </td>
              </tr>
              {invoice?.discount > 0 && (
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      color: "#dc2626",
                    }}
                  >
                    Discount
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      color: "#dc2626",
                    }}
                  >
                    -AUD {invoice.discount}
                  </td>
                </tr>
              )}
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>
                  Total
                </td>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}> AUD  
                   {invoice?.total_amount ||
                    invoice?.appointment_amount ||
                    "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
           <img
          src={logo}
          alt="Logo"
          style={{ height: '40px', objectFit: 'contain', justifyContent: 'center' }}
        />
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            textAlign: "center",
          }}
        >
          Generated on {formatDate(new Date())} | This is a system generated
          invoice.
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;
