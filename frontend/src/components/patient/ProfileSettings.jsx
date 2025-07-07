import React, { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    name: 'Richard Wilson',
    email: 'richard@example.com',
    phone: '9876543210',
    dob: '1995-04-20',
    gender: 'male',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <PatientLayout>
      <h3>Profile Settings</h3>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Date of Birth</label>
          <input type="date" className="form-control" name="dob" value={form.dob} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label>Gender</label>
          <select className="form-control" name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </PatientLayout>
  );
};

export default ProfileSettings;
