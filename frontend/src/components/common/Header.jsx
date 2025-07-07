import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg header-nav">
        <div className="container-fluid">
          {/* Logo */}
          <div className="navbar-header">
            <Link to="/" className="navbar-brand logo">
              <img src="/assets/img/logo.png" className="img-fluid" alt="Logo" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Main Nav */}
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ml-auto main-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>

              {/* Doctors Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  Doctors
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/doctor/dashboard">Doctor Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/appointments">Appointments</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/schedule">Schedule Timing</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/patients">Patients List</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/patient-profile">Patients Profile</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/chat">Chat</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/invoices">Invoices</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/profile-settings">Profile Settings</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/reviews">Reviews</Link></li>
                  <li><Link className="dropdown-item" to="/doctor/register">Doctor Register</Link></li>
                </ul>
              </li>

              {/* Patients Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  Patients
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/search-doctor">Search Doctor</Link></li>
                  <li><Link className="dropdown-item" to="/doctor-profile">Doctor Profile</Link></li>
                  <li><Link className="dropdown-item" to="/booking">Booking</Link></li>
                  <li><Link className="dropdown-item" to="/checkout">Checkout</Link></li>
                  <li><Link className="dropdown-item" to="/booking-success">Booking Success</Link></li>
                  <li><Link className="dropdown-item" to="/patient/dashboard">Patient Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/patient/favourites">Favourites</Link></li>
                  <li><Link className="dropdown-item" to="/patient/chat">Chat</Link></li>
                  <li><Link className="dropdown-item" to="/patient/profile">Profile Settings</Link></li>
                  <li><Link className="dropdown-item" to="/patient/change-password">Change Password</Link></li>
                </ul>
              </li>

              {/* Pages Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  Pages
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/voice-call">Voice Call</Link></li>
                  <li><Link className="dropdown-item" to="/video-call">Video Call</Link></li>
                  <li><Link className="dropdown-item" to="/calendar">Calendar</Link></li>
                  <li><Link className="dropdown-item" to="/components">Components</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><h6 className="dropdown-header">Invoices</h6></li>
                  <li><Link className="dropdown-item" to="/invoices">Invoice</Link></li>
                  <li><Link className="dropdown-item" to="/invoice-view">Invoice View</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/starter">Starter Page</Link></li>
                </ul>
              </li>

              {/* Admin */}
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            </ul>
          </div>

          {/* Right Contact + Login/Signup */}
          <ul className="nav header-navbar-rht">
            <li className="nav-item contact-item d-flex align-items-center mr-3">
              <div className="header-contact-img">
                <i className="far fa-hospital"></i>
              </div>
              <div className="header-contact-detail">
                <p className="contact-header">Contact</p>
                <p className="contact-info-header">+1 315 369 5943</p>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link header-login" to="/login">
                Login / Signup
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
