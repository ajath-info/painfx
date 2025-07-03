import React from 'react';

const Specialities = () => {
  const specialities = [
    { img: 'specialities-01.png', name: 'Urology' },
    { img: 'specialities-02.png', name: 'Neurology' },
    { img: 'specialities-03.png', name: 'Orthopedic' },
    { img: 'specialities-04.png', name: 'Cardiologist' },
    { img: 'specialities-05.png', name: 'Dentist' }
  ];

  return (
    <section className="section section-specialities">
      <div className="container-fluid">
        <div className="section-header text-center">
          <h2>Clinic and Specialities</h2>
          <p className="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="specialities-slider slider">
              {specialities.map((item, index) => (
                <div key={index} className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={`assets/img/specialities/${item.img}`} className="img-fluid" alt="Speciality" />
                    <span><i className="fa fa-circle" aria-hidden="true"></i></span>
                  </div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;