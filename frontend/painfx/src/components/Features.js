import React from 'react';

const Features = () => {
  const features = [
    { img: 'feature-01.jpg', title: 'Patient Ward' },
    { img: 'feature-02.jpg', title: 'Test Room' },
    { img: 'feature-03.jpg', title: 'ICU' },
    { img: 'feature-04.jpg', title: 'Laboratory' },
    { img: 'feature-05.jpg', title: 'Operation' },
    { img: 'feature-06.jpg', title: 'Medical' }
  ];

  return (
    <section className="section section-features">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5 features-img">
            <img src="assets/img/features/feature.png" className="img-fluid" alt="Feature" />
          </div>
          <div className="col-md-7">
            <div className="section-header">
              <h2 className="mt-2">Available Features in Our Clinic</h2>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
            </div>
            <div className="features-slider slider">
              {features.map((item, index) => (
                <div key={index} className="feature-item text-center">
                  <img src={`assets/img/features/${item.img}`} className="img-fluid" alt="Feature" />
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;