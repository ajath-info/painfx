import React from "react";
import { FileText, Download, Calendar, User, Stethoscope, Mail, Phone, MapPin, Clock } from "lucide-react";

const InvoicePDF = ({ invoice }) => {
  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const invoiceHTML = document.getElementById('invoice-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice?.invoice_number || invoice?.id || "N/A"}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
              .invoice-container { box-shadow: none !important; margin: 0 !important; }
              .page-break { page-break-before: always; }
            }
            @page {
              size: A4;
              margin: 0;
            }
            .invoice-container {
              overflow-y: auto;
              max-height: 100vh; /* Limit height to viewport in view mode */
            }
          </style>
        </head>
        <body class="bg-white">
          ${invoiceHTML}
        </body>
      </html>
    `);
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (invoice) => {
    const addressParts = [
      invoice?.patient_address1,
      invoice?.patient_address2,
      invoice?.patient_city,
      invoice?.patient_state,
      invoice?.patient_country,
      invoice?.patient_pin_code,
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
  };

  const sampleInvoice = {
    invoice_number: "INV-20250717-00010",
    invoice_date: "2025-07-17",
    patient_name: "Shahrukh Khan",
    patient_email: "shahrukh.khan@brancosoft.com",
    patient_phone: "9540083310",
    patient_address1: "Noida, Noida, Noida",
    patient_city: "UP",
    patient_country: "India",
    patient_pin_code: "21010",
    doctor_name: "Dr. Vishesh Singh",
    doctor_email: "shahrukh.khan072@gmail.com",
    specializations: ["General Medicine", "Internal Medicine"],
    appointment_date: "2025-07-17T12:00:00",
    consultation_type: "clinic_visit",
    total_amount: "500.00"
  };

  const invoiceData = invoice || sampleInvoice;

  return (
    <div className="w-full bg-gray-50 p-4 min-h-screen overflow-y-auto">
      {/* Download Button */}
      <div className="no-print mb-6 flex justify-center">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>

      {/* Invoice Container */}
      <div 
        id="invoice-content" 
        className="invoice-container bg-white mx-auto shadow-2xl rounded-lg"
        style={{ maxWidth: '794px' }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Stethoscope size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide">MEDICAL INVOICE</h1>
                <p className="text-blue-100 mt-1 text-sm">Professional Healthcare Services</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                <p className="text-blue-100 text-sm">Invoice Number</p>
                <h2 className="text-xl font-bold">#{invoiceData.invoice_number}</h2>
              </div>
              <p className="text-blue-100 mt-3 text-sm">
                <Calendar className="inline mr-2" size={14} />
                {formatDate(invoiceData.invoice_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8">
          {/* Bill To & Service Provider Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <User className="text-blue-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">BILL TO</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-bold text-gray-900">{invoiceData.patient_name}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{invoiceData.patient_email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{invoiceData.patient_phone}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin size={16} className="mr-3 mt-1 text-blue-500 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{formatAddress(invoiceData)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <Stethoscope className="text-green-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">SERVICE PROVIDER</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-bold text-gray-900">{invoiceData.doctor_name}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-3 text-green-500" />
                  <span className="text-sm">{invoiceData.doctor_email}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">SPECIALIZATIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {invoiceData.specializations?.map((spec, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {spec}
                      </span>
                    )) || <span className="text-gray-500 text-sm">N/A</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-8 border border-yellow-200">
            <div className="flex items-center mb-4">
              <Calendar className="text-yellow-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">APPOINTMENT DETAILS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Clock className="text-yellow-600 mr-3" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">APPOINTMENT DATE & TIME</p>
                  <p className="text-gray-800 font-bold">{formatDateTime(invoiceData.appointment_date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="text-yellow-600 mr-3" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">CONSULTATION TYPE</p>
                  <p className="text-gray-800 font-bold capitalize">
                    {invoiceData.consultation_type?.replace('_', ' ') || "Standard Consultation"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
              SERVICES PROVIDED
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">Medical Consultation Services</div>
                      <div className="text-sm text-gray-500">Professional medical examination and consultation</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {invoiceData.consultation_type?.replace('_', ' ') || "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-lg text-gray-900">
                      ₹{invoiceData.total_amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-center">INVOICE SUMMARY</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="font-semibold">₹{invoiceData.total_amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Tax (GST 0%):</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-yellow-400">
                    <span className="text-xl font-bold">TOTAL AMOUNT:</span>
                    <span className="text-2xl font-bold text-yellow-400">₹{invoiceData.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-1">✓ PAYMENT COMPLETED</h4>
                  <p className="text-green-100">This invoice has been paid in full. Thank you!</p>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="font-bold text-sm">PAID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Thank You for Choosing Our Medical Services!</h4>
              <p className="text-gray-600 text-sm mb-4">
                We appreciate your trust in our healthcare services. Your health and well-being are our top priority.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 inline-block">
                <p className="text-blue-800 text-sm font-medium">
                  For any queries regarding this invoice, please contact our billing department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;