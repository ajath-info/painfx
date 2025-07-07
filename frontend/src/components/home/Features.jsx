import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Patient Information',
      icon: '/assets/img/features/feature-01.jpg',
      description: 'Quick access to patient data and history.',
    },
    {
      title: 'Online Booking',
      icon: '/assets/img/features/feature-02.jpg',
      description: 'Patients can book appointments easily.',
    },
    {
      title: 'Instant Consultation',
      icon: '/assets/img/features/feature-03.jpg',
      description: 'Video/Voice call features for fast consultation.',
    },
  ];

  return (
    <section className="section section-features">
      <div className="container-fluid">
        <div className="section-header text-center">
          <h2>Our Features</h2>
          <p className="sub-title">Helping you take care of your health</p>
        </div>
        <div className="row">
          {features.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="feature-box text-center">
                <img src={item.icon} alt={item.title} className="img-fluid" />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
