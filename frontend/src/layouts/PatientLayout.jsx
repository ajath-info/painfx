import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PatientLayout = ({ children }) => {
  const location = useLocation();
  const menu = [
    { label: 'Dashboard', to: '/patient/dashboard', icon: 'fas fa-columns' },
    { label: 'Favourites', to: '/patient/favourites', icon: 'fas fa-bookmark' },
    { label: 'Profile Settings', to: '/patient/profile', icon: 'fas fa-user-cog' },
    { label: 'Change Password', to: '/patient/change-password', icon: 'fas fa-lock' },
    { label: 'Logout', to: '/logout', icon: 'fas fa-sign-out-alt' },
  ];

  const patient = {
    name: 'Richard Wilson',
    dob: '24 Jul 1983',
    age: 38,
    location: 'Newyork, USA',
    avatar: '/assets/images/patient-avatar.jpg', // Ensure this exists
  };

  return (
    <>
      <Header />

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <img
                  src={patient.avatar}
                  alt="Patient"
                  className="img-fluid rounded-circle mb-2"
                  style={{ width: '100px', height: '100px' }}
                />
                <h5>{patient.name}</h5>
                <p className="text-muted mb-0">
                  <i className="far fa-calendar-alt me-1" /> {patient.dob}, {patient.age} years
                </p>
                <p className="text-muted"><i className="fas fa-map-marker-alt me-1" /> {patient.location}</p>
              </div>
              <div className="list-group list-group-flush">
                {menu.map((item, index) => (
                  <Link
                    to={item.to}
                    key={index}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${location.pathname === item.to ? 'active' : ''}`}
                  >
                    <span><i className={`${item.icon} me-2`}></i> {item.label}</span>
                    {item.badge && (
                      <span className="badge badge-success badge-pill">{item.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">{children}</div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PatientLayout;
