import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const PatientProfile = () => {
  // Mock profile data (normally fetched from backend)
  const profile = {
    name: 'Richard Wilson',
    email: 'richard@example.com',
    phone: '+91 9876543210',
    dob: '1995-04-20',
    gender: 'Male',
    avatar: '/assets/images/patient-avatar.jpg', // replace with actual image path
  };

  return (
    <PatientLayout>
      <div className="card">
        <div className="card-header">
          <h4>Patient Profile</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Avatar */}
            <div className="col-md-3 text-center">
              <img
                src={profile.avatar}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div className="col-md-9">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row">Full Name:</th>
                    <td>{profile.name}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email:</th>
                    <td>{profile.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone:</th>
                    <td>{profile.phone}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date of Birth:</th>
                    <td>{profile.dob}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gender:</th>
                    <td>{profile.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientProfile;
