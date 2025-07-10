import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const Appointments = () => {
 const appointments = [
  {
    id: 1,
    name: "Richard Wilson",
    date: "14 Nov 2019",
    time: "10:00 AM",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "New York, United States",
    email: "richard@example.com",
    phone: "+1 923 782 4575",
  },
  {
    id: 2,
    name: "Emma Watson",
    date: "15 Nov 2019",
    time: "12:30 PM",
    img: "https://randomuser.me/api/portraits/women/4.jpg",
    location: "Los Angeles, USA",
    email: "emma@example.com",
    phone: "+1 123 456 7890",
  },
];

  return (
     <div className="space-y-4 text-lg">
      {appointments.map((appt) => (
        <div key={appt.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between">
          
          {/* Patient Info */}
          <div className="flex items-center space-x-4">
            <img
              src={appt.img}
              alt={appt.name}
              className="w-30 h-35 object-cover mr-4"
            />
            <div className='text-xl'>
              <h4 className="font-semibold text-xl text-gray-800">{appt.name}</h4>
              <p className="text-lg text-gray-500">{appt.date}, {appt.time}</p>
              <div className="flex text-lg items-center text-gray-500 mt-1">
                <FaMapMarkerAlt className="mr-1" /> {appt.location || 'New York, United States'}
              </div>
              <div className="flex  items-center text-lg text-gray-500 mt-1">
                <FaEnvelope className="mr-1" /> {appt.email || 'richard@example.com'}
              </div>
              <div className="flex items-center text-lg text-gray-500 mt-1">
                <FaPhone className="mr-1" /> {appt.phone || '+1 923 782 4575'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="px-3 py-1 text-lg   text-blue-500 hover:bg-blue-500 hover:text-white hover:rounded "><i className="fa-solid fa-eye"></i>View</button>
            <button className="px-3 py-1 text-lg   text-green-500 hover:bg-green-500 hover:text-white hover:rounded"><i className="fa-solid fa-check"></i>Accept</button>
            <button className="px-3 py-1 text-lg   text-red-500 hover:bg-red-500 hover:text-white hover:rounded"><i className="fa-solid fa-xmark"></i>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Appointments;
