import React, { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const ChangePassword = () => {
  const [form, setForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      alert('Passwords do not match!');
    } else {
      alert('Password changed successfully!');
    }
  };

  return (
    <PatientLayout>
      <h3>Change Password</h3>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Current Password</label>
          <input type="password" className="form-control" name="current" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>New Password</label>
          <input type="password" className="form-control" name="newPass" onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label>Confirm Password</label>
          <input type="password" className="form-control" name="confirm" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Password</button>
      </form>
    </PatientLayout>
  );
};

export default ChangePassword;
