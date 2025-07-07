import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-about">
                <div className="footer-logo">
                  <img src="/assets/img/logo.png" alt="logo" />
                </div>
                <p>Doccure - Appointment Booking Platform for Doctors & Patients</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Patients</h2>
                <ul>
                  <li><a href="#">Search for Doctors</a></li>
                  <li><a href="#">Login</a></li>
                  <li><a href="#">Register</a></li>
                  <li><a href="#">Booking</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Doctors</h2>
                <ul>
                  <li><a href="#">Appointments</a></li>
                  <li><a href="#">Chat</a></li>
                  <li><a href="#">Login</a></li>
                  <li><a href="#">Register</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
