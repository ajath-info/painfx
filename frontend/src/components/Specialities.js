import React from 'react';
import Slider from 'react-slick';

const Specialities = () => {
  const specialities = [
    {
      id: 1,
      name: 'Urology',
      image: '/assets/img/specialities/specialities-01.png'
    },
    {
      id: 2,
      name: 'Neurology',
      image: '/assets/img/specialities/specialities-02.png'
    },
    {
      id: 3,
      name: 'Orthopedic',
      image: '/assets/img/specialities/specialities-03.png'
    },
    {
      id: 4,
      name: 'Cardiologist',
      image: '/assets/img/specialities/specialities-04.png'
    },
    {
      id: 5,
      name: 'Dentist',
      image: '/assets/img/specialities/specialities-05.png'
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="section section-specialities">
      <div className="container-fluid">
        <div className="section-header text-center">
          <h2>Clinic and Specialities</h2>
          <p className="sub-title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-9">
            {/* Slider */}
            <Slider {...settings} className="specialities-slider">
              {specialities.map((speciality) => (
                <div key={speciality.id} className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={speciality.image} className="img-fluid" alt="Speciality" />
                    <span>
                      <i className="fa fa-circle" aria-hidden="true"></i>
                    </span>
                  </div>
                  <p>{speciality.name}</p>
                </div>
              ))}
            </Slider>
            {/* /Slider */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;