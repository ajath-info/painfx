import React from 'react';

const Specialities = () => {
  const specialities = [
    { name: 'Urology', icon: '/assets/img/specialities/specialities-01.png' },
    { name: 'Neurology', icon: '/assets/img/specialities/specialities-02.png' },
    { name: 'Orthopedic', icon: '/assets/img/specialities/specialities-03.png' },
    { name: 'Cardiologist', icon: '/assets/img/specialities/specialities-04.png' },
    { name: 'Dentist', icon: '/assets/img/specialities/specialities-05.png' },
  ];

  return (
    <section className="section section-specialities">
      <div className="container-fluid">
        <div className="section-header text-center">
          <h2>Clinic & Specialities</h2>
          <p className="sub-title">Explore our top specialities and clinics</p>
        </div>
        <div className="row justify-content-center">
          {specialities.map((item, index) => (
            <div key={index} className="col-md-4 col-lg-2">
              <div className="specialities-item text-center">
                <div className="specialities-img">
                  <img src={item.icon} alt={item.name} className="img-fluid" />
                </div>
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;
