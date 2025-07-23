import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

    await new Promise((r) => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => element.tagName.toLowerCase() === "style" || element.style.color?.includes("oklch"),
        foreignObjectRendering: false, // Disable rendering of foreign objects to avoid oklch in SVGs
        logging: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoice?.invoice_number || invoice?.id || "N/A"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. The error may be due to 'oklch' colors in styles. Please check your CSS (e.g., Tailwind config) and replace with 'rgb' or 'hex' colors, then try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
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
      if (isNaN(date.getTime())) throw new Error("Invalid time");
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
      if (isNaN(date.getTime())) throw new Error("Invalid date or time");
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
    <div className="w-full bg-gray-50 min-h-screen p-4">
      {/* Download Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Invoice Container with Scroll */}
      <div
        ref={invoiceRef}
        className="bg-white max-w-3xl mx-auto rounded-lg shadow-xl p-6 overflow-auto"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText size={24} /> Invoice
          </h1>
          <span className="text-sm text-gray-600">
            Invoice No: <strong>{invoice?.invoice_number || "N/A"}</strong>
          </span>
        </div>

        {/* Patient Info */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <User size={18} /> Billed To
            </h2>
            <p>{invoice?.patient_name || "N/A"}</p>
            <p className="flex items-center gap-1 text-sm text-gray-700">
              <Mail size={14} /> {invoice?.patient_email || "N/A"}
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-700">
              <Phone size={14} /> {invoice?.patient_phone || "N/A"}
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-700">
              <MapPin size={14} /> {formatAddress()}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Stethoscope size={18} /> Provider
            </h2>
            <p>{invoice?.doctor_name || "N/A"}</p>
            <p className="flex items-center gap-1 text-sm text-gray-700">
              <Mail size={14} /> {invoice?.doctor_email || "N/A"}
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-700">
              <Phone size={14} /> {invoice?.doctor_phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar size={18} /> Appointment Details
          </h2>
          <p className="flex items-center gap-2 text-sm text-gray-800">
            <Clock size={14} />
            {formatDateTime(invoice?.appointment_date, invoice?.appointment_time)}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Type: {(invoice?.consultation_type || "N/A").replace(/_/g, " ") || "N/A"}
          </p>
        </div>

        {/* Charges Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100 text-left text-sm font-medium">
              <tr>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Consultation Fee</td>
                <td className="p-2 border">${invoice?.appointment_amount || "0.00"}</td>
              </tr>
              {invoice?.discount > 0 && (
                <tr>
                  <td className="p-2 border text-red-500">Discount</td>
                  <td className="p-2 border text-red-500">
                    -${invoice.discount}
                  </td>
                </tr>
              )}
              <tr className="font-bold">
                <td className="p-2 border">Total</td>
                <td className="p-2 border">
                  ${invoice?.total_amount || invoice?.appointment_amount || "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 border-t pt-4 text-center">
          Generated on {formatDate(new Date())} | This is a system generated invoice.
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;