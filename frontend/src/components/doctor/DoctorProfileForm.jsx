import React, { useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';

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
    <DoctorLayout>
      <div className="max-w-8xl mx-auto p-4 space-y-8">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="gap-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-36 h-36 border-4 border-blue-100 shadow-md object-cover mb-8" />
              <div className="flex flex-col items-start">
                <button className="items-center justify-center flex gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition duration-300">
                  Upload Photo
                </button>
                <p className="text-lg text-gray-500 mt-2 max-w-xs mb-4">
                  Allowed JPG, GIF, PNG. Max size 2MB
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Username *', 'Email *', 'First Name *', 'Last Name *', 'Phone Number', 'Gender', 'Date of Birth'].map((label, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-xl font-semibold text-gray-700 mb-1">{label}</label>
                  {label.includes('Gender') ? (
                    <select className="border rounded-lg p-3 w-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  ) : (
                    <input
                      type={label.includes('Email') ? 'email' : label.includes('Date') ? 'date' : 'text'}
                      placeholder={label.replace(' *', '')}
                      disabled={label.includes('Username') || label.includes('Email')}
                      className={`border rounded-lg p-3 w-full text-sm ${label.includes('Username') || label.includes('Email') ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Sections */}
        {[{
          title: 'About Me',
          content: (
            <div className="border-gray-300 rounded-lg p-4 bg-white">
              <label htmlFor="biography" className="block text-lg font-semibold text-gray-600 mb-1">Biography</label>
              <textarea id="biography" className="w-full h-32 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 p-2 resize-none"></textarea>
            </div>
          )
        }, {
          title: 'Clinic Info',
          content: (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Clinic Name *', 'Clinic Address *'].map((label, idx) => (
                  <div key={idx} className="flex flex-col">
                    <label className="text-xl font-semibold text-gray-700 mb-1">{label}</label>
                    <input type="text" className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-dashed p-10 text-center text-gray-500 rounded text-lg font-semibold">Drop files here to upload</div>
              <div className="flex gap-2 mt-4">
                {[1, 2].map(i => <img key={i} src="https://via.placeholder.com/80" alt="Clinic" className="w-20 h-20 rounded border" />)}
              </div>
            </>
          )
        }, {
          title: 'Contact Details',
          fields: ['Address Line 1', 'Address Line 2', 'City', 'State / Province', 'Country', 'Postal Code']
        }, {
          title: 'Pricing',
          content: (
            <div className="flex gap-4 items-center">
              {['Free', 'Custom Price (per hour)'].map((label, idx) => (
                <label key={idx} className="flex items-center gap-2 text-lg">
                  <input type="radio" name="pricing" defaultChecked={idx === 0} /> {label}
                </label>
              ))}
            </div>
          )
        }].map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            {section.fields ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field, i) => (
                  <div key={i} className="flex flex-col">
                    <label className="text-xl font-semibold text-gray-700 mb-1">{field}</label>
                    <input type="text" className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            ) : section.content}
          </div>
        ))}

        {/* Dynamic Sections */}
        {[{
          title: 'Education',
          data: educations,
          addHandler: addEducation,
          fields: ['Degree', 'College/Institute', 'Year of Completion']
        }, {
          title: 'Experience',
          data: experiences,
          addHandler: addExperience,
          fields: ['Hospital Name', 'From', 'To', 'Designation']
        }, {
          title: 'Awards',
          data: awards,
          addHandler: addAward,
          fields: ['Awards', 'Year']
        }, {
          title: 'Memberships',
          data: memberships,
          addHandler: addMembership,
          fields: ['Memberships']
        }, {
          title: 'Registrations',
          data: registrations,
          addHandler: addRegistration,
          fields: ['Registration', 'Year']
        }].map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            {section.data.map((item, i) => (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-${section.fields.length > 2 ? '3' : '2'} gap-4 mb-2`}>
                {section.fields.map((field, j) => (
                  <div key={j} className="flex flex-col">
                    <label className="text-lg font-semibold text-gray-700 mb-1">{field}</label>
                    <input type="text" className="border rounded-lg p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={section.addHandler} className="text-blue-600 font-semibold text-lg mt-3">+ Add More</button>
          </div>
        ))}

      </div>
    </DoctorLayout>
  );
};

export default DoctorProfileForm;