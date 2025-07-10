import React, { useState } from 'react';

const DoctorProfileForm = () => {
  const [services, setServices] = useState(['Tooth cleaning']);
  const [specializations, setSpecializations] = useState(['Children Care', 'Dental Care']);
  const [educations, setEducations] = useState([{ degree: '', college: '', year: '' }]);
  const [experiences, setExperiences] = useState([{ hospital: '', from: '', to: '', designation: '' }]);
  const [awards, setAwards] = useState([{ award: '', year: '' }]);
  const [memberships, setMemberships] = useState(['']);
  const [registrations, setRegistrations] = useState([{ registration: '', year: '' }]);

  const addEducation = () => setEducations([...educations, { degree: '', college: '', year: '' }]);
  const addExperience = () => setExperiences([...experiences, { hospital: '', from: '', to: '', designation: '' }]);
  const addAward = () => setAwards([...awards, { award: '', year: '' }]);
  const addMembership = () => setMemberships([...memberships, '']);
  const addRegistration = () => setRegistrations([...registrations, { registration: '', year: '' }]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">

      {/* Basic Info */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-24 h-24 rounded-full" />
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm">Upload Photo</button>
            <p className="text-lg mt-1">Allowed JPG, GIF, PNG. Max size 2MB</p>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Username *" className="border rounded p-2 w-full" disabled />
            <input type="email" placeholder="Email *" className="border rounded p-2 w-full" disabled />
            <input type="text" placeholder="First Name *" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Last Name *" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Phone Number" className="border rounded p-2 w-full" />
            <select className="border rounded p-2 w-full">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input type="date" placeholder="Date of Birth" className="border rounded p-2 w-full" />
          </div>
        </div>
      </div>

      {/* Clinic Info */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Clinic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Clinic Name" className="border rounded p-2 w-full" />
          <input type="text" placeholder="Clinic Address" className="border rounded p-2 w-full" />
        </div>
        <div className="mt-4 border border-dashed p-8 text-center text-gray-500 rounded">Drop files here to upload</div>
        <div className="flex gap-2 mt-4">
          <img src="https://via.placeholder.com/80" alt="Clinic" className="w-20 h-20 rounded border" />
          <img src="https://via.placeholder.com/80" alt="Clinic" className="w-20 h-20 rounded border" />
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Address Line 1" className="border rounded p-2 w-full" />
          <input type="text" placeholder="Address Line 2" className="border rounded p-2 w-full" />
          <input type="text" placeholder="City" className="border rounded p-2 w-full" />
          <input type="text" placeholder="State / Province" className="border rounded p-2 w-full" />
          <input type="text" placeholder="Country" className="border rounded p-2 w-full" />
          <input type="text" placeholder="Postal Code" className="border rounded p-2 w-full" />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-xl">
            <input type="radio" name="pricing" checked /> Free
          </label>
          <label className="flex items-center gap-2 text-xl">
            <input type="radio" name="pricing" /> Custom Price (per hour)
          </label>
        </div>
      </div>

      {/* Services & Specialization */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Services and Specialization</h2>
        <input type="text" placeholder="Services" className="border rounded p-2 w-full mb-2" />
        <input type="text" placeholder="Specialization" className="border rounded p-2 w-full" />
      </div>

      {/* Education */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        {educations.map((edu, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <input type="text" placeholder="Degree" className="border rounded p-2 w-full" />
            <input type="text" placeholder="College/Institute" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Year of Completion" className="border rounded p-2 w-full" />
          </div>
        ))}
        <button onClick={addEducation} className="text-blue-500 text-sm mt-2">+ Add More</button>
      </div>

      {/* Experience */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {experiences.map((exp, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <input type="text" placeholder="Hospital Name" className="border rounded p-2 w-full" />
            <input type="text" placeholder="From" className="border rounded p-2 w-full" />
            <input type="text" placeholder="To" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Designation" className="border rounded p-2 w-full col-span-3" />
          </div>
        ))}
        <button onClick={addExperience} className="text-blue-500 text-sm mt-2">+ Add More</button>
      </div>

      {/* Awards */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Awards</h2>
        {awards.map((awd, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Award" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Year" className="border rounded p-2 w-full" />
          </div>
        ))}
        <button onClick={addAward} className="text-blue-500 text-sm mt-2">+ Add More</button>
      </div>

      {/* Memberships */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Memberships</h2>
        {memberships.map((mem, idx) => (
          <input key={idx} type="text" placeholder="Membership" className="border rounded p-2 w-full mb-2" />
        ))}
        <button onClick={addMembership} className="text-blue-500 text-sm mt-2">+ Add More</button>
      </div>

      {/* Registrations */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Registrations</h2>
        {registrations.map((reg, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Registration" className="border rounded p-2 w-full" />
            <input type="text" placeholder="Year" className="border rounded p-2 w-full" />
          </div>
        ))}
        <button onClick={addRegistration} className="text-blue-500 text-sm mt-2">+ Add More</button>
      </div>

    </div>
  );
};

export default DoctorProfileForm;
