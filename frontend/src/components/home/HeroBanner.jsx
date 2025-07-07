import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <section className="section section-search">
      <div className="container-fluid">
        <div className="banner-wrapper">
          <div className="banner-header text-center">
            <h1>Search Doctor, Make an Appointment</h1>
            <p>Discover the best doctors nearest to you.</p>
          </div>
          <div className="search-box">
            <form>
              <div className="form-group search-location">
                <input type="text" className="form-control" placeholder="Search Location" />
              </div>
              <div className="form-group search-info">
                <input type="text" className="form-control" placeholder="Search Doctors, Clinics, Hospitals, etc." />
              </div>
              <button type="submit" className="btn btn-primary search-btn">
                <i className="fas fa-search"></i> <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
