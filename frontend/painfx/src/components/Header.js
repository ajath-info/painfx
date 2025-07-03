import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg header-nav">
        <div className="navbar-header">
          <a id="mobile_btn" href="#">
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <a href="/" className="navbar-brand logo">
            <img src="assets/img/logo.png" className="img-fluid" alt="Logo" />
          </a>
        </div>
        <div className="main-menu-wrapper">
          <div className="menu-header">
            <a href="/" className="menu-logo">
              <img src="assets/img/logo.png" className="img-fluid" alt="Logo" />
            </a>
            <a id="menu_close" className="menu-close" href="#">
              <i className="fas fa-times"></i>
            </a>
          </div>
          <ul className="main-nav">
            <li className="active"><a href="/">Home</a></li>
            <li className="has-submenu">
              <a href="#">Doctors <i className="fas fa-chevron-down"></i></a>
              <ul className="submenu">
                <li><a href="/doctor-dashboard">Doctor Dashboard</a></li>
                <li><a href="/appointments">Appointments</a></li>
                <li><a href="/schedule-timings">Schedule Timing</a></li>
                <li><a href="/my-patients">Patients List</a></li>
                <li><a href="/patient-profile">Patients Profile</a></li>
                <li><a href="/chat-doctor">Chat</a></li>
                <li><a href="/invoices">Invoices</a></li>
                <li><a href="/doctor-profile-settings">Profile Settings</a></li>
                <li><a href="/reviews">Reviews</a></li>
                <li><a href="/doctor-register">Doctor Register</a></li>
              </ul>
            </li>
            <li className="has-submenu">
              <a href="#">Patients <i className="fas fa-chevron-down"></i></a>
              <ul className="submenu">
                <li><a href="/search">Search Doctor</a></li>
                <li><a href="/doctor-profile">Doctor Profile</a></li>
                <li><a href="/booking">Booking</a></li>
                <li><a href="/checkout">Checkout</a></li>
                <li><a href="/booking-success">Booking Success</a></li>
                <li><a href="/patient-dashboard">Patient Dashboard</a></li>
                <li><a href="/favourites">Favourites</a></li>
                <li><a href="/chat">Chat</a></li>
                <li><a href="/profile-settings">Profile Settings</a></li>
                <li><a href="/change-password">Change Password</a></li>
              </ul>
            </li>
            <li className="has-submenu">
              <a href="#">Pages <i className="fas fa-chevron-down"></i></a>
              <ul className="submenu">
                <li><a href="/voice-call">Voice Call</a></li>
                <li><a href="/video-call">Video Call</a></li>
                <li><a href="/calendar">Calendar</a></li>
                <li><a href="/components">Components</a></li>
                <li><a href="/blank-page">Starter Page</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>
                <li><a href="/forgot-password">Forgot Password</a></li>
              </ul>
            </li>
            <li><a href="/admin">Admin</a></li>
            <li className="login-link"><a href="/login">Login / Signup</a></li>
          </ul>
        </div>
        <ul className="nav header-navbar-rht">
          <li className="nav-item contact-item">
            <div className="header-contact-img">
              <i className="far fa-hospital"></i>
            </div>
            <div className="header-contact-detail">
              <p className="contact-header">Contact</p>
              <p className="contact-info-header"> +1 315 369 5943</p>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link header-login" href="/login">login / Signup </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;