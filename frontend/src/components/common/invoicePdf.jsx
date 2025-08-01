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
    <div className="w-full h-screen flex flex-col bg-gray-50 p-2 sm:p-4 max-h-screen overflow-hidden">
      {/* Fixed Header - Download Button and Logo */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md border-none cursor-pointer hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
        >
          <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
          Download PDF
        </button>

        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-8 sm:h-10 object-contain self-start sm:self-center"
        />
      </div>

      {/* Scrollable Invoice Container */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={invoiceRef}
          className="bg-white max-w-4xl mx-auto rounded-lg p-4 sm:p-6 shadow-lg h-full overflow-y-auto"
        >
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4 mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold inline-flex items-center gap-2">
            <FileText size={20} className="sm:w-6 sm:h-6" />
            Invoice
          </h1>
          
          <span className="text-sm text-gray-600">
            Invoice No: <strong>{invoice?.invoice_number || "N/A"}</strong>
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6">
          {/* Patient and Provider Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Billed To */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold inline-flex items-center gap-2 mb-3">
                <User size={18} />
                Billed To
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{invoice?.patient_name || "N/A"}</p>
                
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="break-all">{invoice?.patient_email || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{invoice?.patient_phone || "N/A"}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="break-words">{formatAddress()}</span>
                </div>
              </div>
            </div>

            {/* Provider */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold inline-flex items-center gap-2 mb-3">
                <Stethoscope size={18} />
                Provider
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{invoice?.doctor_name || "N/A"}</p>
                
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="break-all">{invoice?.doctor_email || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{invoice?.doctor_phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div>
            <h2 className="text-lg font-semibold inline-flex items-center gap-2 mb-3">
              <Calendar size={18} />
              Appointment Details
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-800">
                <Clock size={14} className="mt-0.5 flex-shrink-0" />
                <span>{formatDateTime(invoice?.appointment_date, invoice?.appointment_time)}</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">
                Type: {(invoice?.consultation_type || "N/A").replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Charges Table */}
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 min-w-[300px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 sm:p-3 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left text-sm font-semibold whitespace-nowrap">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 sm:p-3 text-sm">
                      Consultation Fee
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-sm whitespace-nowrap">
                      AUD {invoice?.appointment_amount || "0.00"}
                    </td>
                  </tr>
                  {invoice?.discount > 0 && (
                    <tr>
                      <td className="border border-gray-300 p-2 sm:p-3 text-sm text-red-600">
                        Discount
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-sm text-red-600 whitespace-nowrap">
                        -AUD {invoice.discount}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 p-2 sm:p-3 text-sm">
                      Total
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-sm whitespace-nowrap">
                      AUD {invoice?.total_amount || invoice?.appointment_amount || "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Logo"
              className="h-8 sm:h-10 object-contain"
            />
          </div>

          {/* Footer */}
          <div className="text-xs sm:text-sm text-gray-500 border-t border-gray-200 pt-4 text-center">
            <p className="break-words">
              Generated on {formatDate(new Date())} | This is a system generated invoice.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;