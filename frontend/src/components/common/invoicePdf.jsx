import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../images/logo-white.jpg";
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
  ArrowLeft,
} from "lucide-react";
const logo = 'https://cdn.shopify.com/s/files/1/0800/9151/2866/files/logo-white.jpg?v=1754050675';

const InvoicePDF = ({ invoice }) => {
  const invoiceRef = useRef();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); // Go back one page
  };

  const downloadPDF = async () => {
    const input = invoiceRef.current;
    if (!input) return;

    // Wait to ensure DOM updates
    await new Promise((r) => setTimeout(r, 300));

    try {
      // Create a clean printable version without the outer container styles
      const invoiceContent = input.cloneNode(true);
      
      // Create a temporary container for printing
      const printWindow = window.open("", "_blank");
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${invoice?.invoice_number || 'N/A'}</title>
            <meta charset="utf-8">
            <style>
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                @page {
                  margin: 0.5in;
                  size: A4;
                }
              }
              
              * {
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.5;
                color: #374151;
                background: white;
                margin: 0;
                padding: 20px;
              }
              
              .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 0;
              }
              
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              
              .header h1 {
                font-size: 28px;
                font-weight: bold;
                color: #111827;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .invoice-number {
                font-size: 14px;
                color: #6b7280;
              }
              
              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 30px;
              }
              
              .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .contact-info {
                margin-bottom: 20px;
              }
              
              .contact-item {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 14px;
                color: #4b5563;
              }
              
              .contact-item .icon {
                width: 16px;
                height: 16px;
                margin-top: 2px;
                flex-shrink: 0;
              }
              
              .patient-name, .doctor-name {
                font-weight: 600;
                color: #111827;
                font-size: 16px;
                margin-bottom: 10px;
              }
              
              .appointment-section {
                margin-bottom: 30px;
              }
              
              .appointment-details {
                font-size: 14px;
                color: #4b5563;
                margin-left: 24px;
              }
              
              .charges-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                font-size: 14px;
              }
              
              .charges-table th,
              .charges-table td {
                border: 1px solid #d1d5db;
                padding: 12px;
                text-align: left;
              }
              
              .charges-table th {
                background-color: #f9fafb;
                font-weight: 600;
                color: #111827;
              }
              
              .charges-table .total-row {
                background-color: #f9fafb;
                font-weight: 600;
              }
              
              .discount-row {
                color: #dc2626;
              }
              
              .logo-center {
                text-align: center;
                margin: 30px 0;
              }
              
              .logo-center img {
                height: 40px;
                object-fit: contain;
              }
              
              .footer {
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
                margin-top: 30px;
              }
              
              .icon {
                display: inline-block;
                width: 18px;
                height: 18px;
              }
              
              @media (max-width: 600px) {
                .grid {
                  grid-template-columns: 1fr;
                  gap: 20px;
                }
                
                .header {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="header">
                <h1>
                  Invoice
                </h1>
                <div class="invoice-number">
                  Invoice No: <strong>${invoice?.invoice_number || "N/A"}</strong>
                </div>
              </div>
              
              <div class="grid">
                <div class="contact-info">
                  <h2 class="section-title">
                    <span class="icon">👤</span>
                    Billed To
                  </h2>
                  <div class="patient-name">${invoice?.patient_name || "N/A"}</div>
                  <div class="contact-item">
                    <span class="icon">✉️</span>
                    <span>${invoice?.patient_email || "N/A"}</span>
                  </div>
                  <div class="contact-item">
                    <span class="icon">📞</span>
                    <span>${invoice?.patient_phone || "N/A"}</span>
                  </div>
                  <div class="contact-item">
                    <span class="icon">📍</span>
                    <span>${formatAddress()}</span>
                  </div>
                </div>
                
                <div class="contact-info">
                  <h2 class="section-title">
                    <span class="icon">🩺</span>
                    Provider
                  </h2>
                  <div class="doctor-name">${invoice?.doctor_name || "N/A"}</div>
                  <div class="contact-item">
                    <span class="icon">✉️</span>
                    <span>${invoice?.doctor_email || "N/A"}</span>
                  </div>
                  <div class="contact-item">
                    <span class="icon">📞</span>
                    <span>${invoice?.doctor_phone || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              <div class="appointment-section">
                <h2 class="section-title">
                  <span class="icon">📅</span>
                  Appointment Details
                </h2>
                <div class="contact-item">
                  <span class="icon">🕐</span>
                  <span>${formatDateTime(invoice?.appointment_date, invoice?.appointment_time)}</span>
                </div>
                <div class="appointment-details">
                  Type: ${(invoice?.consultation_type || "N/A").replace(/_/g, " ")}
                </div>
              </div>
              
              <table class="charges-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Consultation Fee</td>
                    <td>AUD ${invoice?.appointment_amount || "0.00"}</td>
                  </tr>
                  ${invoice?.discount > 0 ? `
                  <tr class="discount-row">
                    <td>Discount</td>
                    <td>-AUD ${invoice.discount}</td>
                  </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td>Total</td>
                    <td>AUD ${invoice?.total_amount || invoice?.appointment_amount || "0.00"}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="logo-center">
                <img src="${logo}" alt="Logo" />
              </div>
              
              <div class="footer">
                Generated on ${formatDate(new Date())} | This is a system generated invoice.
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      console.error("Print failed:", error);
      alert("Failed to print. Please check your connection and try again.");
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
      {/* Fixed Header - Buttons and Logo */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        {/* Buttons Container */}
        <div className="flex gap-2">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md border-none cursor-pointer hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            Cancel
          </button>
          
          {/* Download Button */}
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md border-none cursor-pointer hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
            Download PDF
          </button>
        </div>

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