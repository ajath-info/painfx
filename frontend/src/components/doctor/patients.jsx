import React from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
const patients = [
  {
    id: 'P0016',
    name: 'Richard Wilson',
    location: 'Alabama, USA',
    phone: '+1 952 001 8563',
    age: '38 Years, Male',
    bloodGroup: 'AB+',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'P0016',
    name: 'Richard Wilson',
    location: 'Alabama, USA',
    phone: '+1 952 001 8563',
    age: '38 Years, Male',
    bloodGroup: 'AB+',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'P0016',
    name: 'Richard Wilson',
    location: 'Alabama, USA',
    phone: '+1 952 001 8563',
    age: '38 Years, Male',
    bloodGroup: 'AB+',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'P0016',
    name: 'Richard Wilson',
    location: 'Alabama, USA',
    phone: '+1 952 001 8563',
    age: '38 Years, Male',
    bloodGroup: 'AB+',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'P0017',
    name: 'Emma Watson',
    location: 'California, USA',
    phone: '+1 452 201 7863',
    age: '29 Years, Female',
    bloodGroup: 'A+',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'P0018',
    name: 'John Smith',
    location: 'Texas, USA',
    phone: '+1 852 301 5563',
    age: '45 Years, Male',
    bloodGroup: 'B+',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  // Add more patients if needed
];

const PatientCards = () => {
  return (
    <DoctorLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {patients.map((patient, index) => (
        <div key={index} className=" rounded-lg p-6 bg-white shadow hover:shadow-lg transition text-lg">
          <div className="text-center">
            <img src={patient.image} alt={patient.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
            <p className="text-lg text-gray-500 font-medium">Patient ID : <span className="text-gray-700">{patient.id}</span></p>
            <p className="text-lg text-gray-500 mt-1"><i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>{patient.location}</p>
          </div>
         <div className="space-y-2 text-lg mt-4">
  <div className="flex justify-between">
    <span className="font-semibold text-gray-700">Phone:</span>
    <span>{patient.phone}</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold text-gray-700">Age:</span>
    <span>{patient.age}</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold text-gray-700">Blood Group:</span>
    <span>{patient.bloodGroup}</span>
  </div>
</div>

        </div>
      ))}
    </div>
    </DoctorLayout>
  );
};

export default PatientCards;