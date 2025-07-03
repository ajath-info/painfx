import React from 'react';

const DoctorSection = () => {
  return (
    <section className="section section-doctor">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4">
            <div className="section-header">
              <h2>Book Our Doctor</h2>
              <p>Lorem Ipsum is simply dummy text </p>
            </div>
            <div className="about-content">
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
              <p>Various versions have evolved over the years, sometimes by accident.</p>
              <a href="#">Read More..</a>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="doctor-slider slider">
              {/* Map through doctor data dynamically here */}
              <div className="profile-widget">
                <div className="doc-img">
                  <img className="img-fluid" src="assets/img/doctors/doctor-01.jpg" alt="Doctor" />
                  <a href="#" className="fav-btn">
                    <i className="far fa-bookmark"></i>
                  </a>
                </div>
                <div className="pro-content">
                  <h3 className="title">Dr. Ruby Perrin <i className="fas fa-check-circle verified"></i></h3>
                  <p className="speciality">MDS - Periodontology</p>
                  <div className="rating">
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <span className="d-inline-block average-rating">(17)</span>
                  </div>
                  <ul className="available-info">
                    <li><i className="fas fa-map-marker-alt"></i> Florida, USA</li>
                    <li><i className="far fa-clock"></i> Available on Fri, 22 Mar</li>
                    <li><i className="far fa-money-bill-alt"></i> $300 - $1000</li>
                  </ul>
                  <div className="row row-sm">
                    <div className="col-6">
                      <a href="#" className="btn view-btn">View Profile</a>
                    </div>
                    <div className="col-6">
                      <a href="#" className="btn book-btn">Book Now</a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Repeat as needed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;