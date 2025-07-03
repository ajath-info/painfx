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
                  <img src="assets/img/footer-logo.png" alt="logo" />
                </div>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Patients</h2>
                <ul>
                  <li><a href="/search">Search Doctors</a></li>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/register">Register</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Doctors</h2>
                <ul>
                  <li><a href="/appointments">Appointments</a></li>
                  <li><a href="/chat">Chat</a></li>
                  <li><a href="/doctor-dashboard">Doctor Dashboard</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-contact">
                <h2 className="footer-title">Contact Us</h2>
                <p>3556 Beech Street, San Francisco, CA 94108</p>
                <p>+1 315 369 5943</p>
                <p>doccure@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-fluid">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-0">&copy; Templates Hub</p>
              </div>
              <div className="col-md-6">
                <ul className="policy-menu">
                  <li><a href="/term-condition">Terms and Conditions</a></li>
                  <li><a href="/privacy-policy">Policy</a></li>
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