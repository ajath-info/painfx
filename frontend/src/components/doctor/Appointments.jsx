import React from 'react';

const Appointments = () => {
  const appointments = [
    {
      id: 1,
      patient: 'Richard Wilson',
      date: '11 Nov 2025',
      time: '10:00am - 10:15am',
      purpose: 'General Checkup',
      type: 'New Patient',
      image: '/assets/img/patients/patient1.jpg',
    },
    {
      id: 2,
      patient: 'Charlene Reed',
      date: '12 Nov 2025',
      time: '11:00am - 11:30am',
      purpose: 'Dental Exam',
      type: 'Old Patient',
      image: '/assets/img/patients/patient2.jpg',
    },
    // Add more appointments if needed
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h4>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Appt Date</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 flex items-center space-x-3">
                  <img
                    src={appt.image}
                    alt={appt.patient}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">{appt.patient}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{appt.date}</div>
                  <div className="text-cyan-600 text-sm">{appt.time}</div>
                </td>
                <td className="px-4 py-4">{appt.purpose}</td>
                <td className="px-4 py-4">{appt.type}</td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button className="bg-cyan-100 text-cyan-600 hover:bg-cyan-200 px-3 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <i className="fa fa-eye"></i>
                    <span>View</span>
                  </button>
                  <button className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <i className="fa fa-check"></i>
                    <span>Accept</span>
                  </button>
                  <button className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <i className="fa fa-times"></i>
                    <span>Cancel</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
