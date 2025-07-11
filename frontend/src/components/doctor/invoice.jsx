import React from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
const invoice = () => {
  const invoices = [
    { id: '#INV-0010', patient: 'Richard Wilson', patientId: '#PT0016', amount: '$450', paidOn: '14 Nov 2019' },
    { id: '#INV-0009', patient: 'Charlene Reed', patientId: '#PT001', amount: '$200', paidOn: '13 Nov 2019' },
    { id: '#INV-0008', patient: 'Travis Trimble', patientId: '#PT002', amount: '$100', paidOn: '12 Nov 2019' },
    { id: '#INV-0007', patient: 'Carl Kelly', patientId: '#PT003', amount: '$350', paidOn: '11 Nov 2019' },
    { id: '#INV-0006', patient: 'Michelle Fairfax', patientId: '#PT004', amount: '$275', paidOn: '10 Nov 2019' },
    { id: '#INV-0005', patient: 'Gina Moore', patientId: '#PT005', amount: '$600', paidOn: '9 Nov 2019' },
    { id: '#INV-0004', patient: 'Elsie Gilley', patientId: '#PT006', amount: '$50',  },
  ];

  return (
     <DoctorLayout>
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Invoice No</th>
              <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-lg font-semibold text-black uppercase tracking-wider">Paid On</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-lg">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                  {invoice.patient} 
                  <span className="text-gray-500 ml-2">{invoice.patientId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.paidOn}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                              <button className="px-3 py-1 text-lg  shadow  text-green-500 hover:bg-green-500 hover:text-white hover:rounded"><i className="fa-solid fa-eye"></i>View</button>
                                             <button className="px-3 py-1 text-lg shadow   text-blue-500 hover:bg-blue-500 hover:text-white hover:rounded"><i className="fa-solid fa-print"></i>Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </DoctorLayout>
  );
};

export default invoice;