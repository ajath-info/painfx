import React from 'react';

const DoctorSection = () => {
  const doctors = [
    {
      name: 'Dr. Ruby Perrin',
      specialty: 'MBBS, MD - General Medicine',
      image: '/assets/img/doctors/doctor-01.jpg',
      location: 'Florida, USA',
    },
    {
      name: 'Dr. Darren Elder',
      specialty: 'BDS, MDS - Oral & Maxillofacial Surgery',
      image: '/assets/img/doctors/doctor-02.jpg',
      location: 'New York, USA',
    },
  ];

  return (
    <section className="section section-doctor">
      <div className="container-fluid">
        <div className="section-header text-center">
          <h2>Book Our Best Doctors</h2>
          <p className="sub-title">Find expert doctors for all your health concerns</p>
        </div>
        <div className="row">
          {doctors.map((doctor, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="profile-widget">
                <div className="doc-img">
                  <img className="img-fluid" alt={doctor.name} src={doctor.image} />
                </div>
                <div className="pro-content">
                  <h3 className="title">{doctor.name}</h3>
                  <p className="speciality">{doctor.specialty}</p>
                  <ul className="available-info">
                    <li>
                      <i className="fas fa-map-marker-alt"></i> {doctor.location}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
