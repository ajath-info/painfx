import React from 'react';
import { Link } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';

const Favourites = () => {
  const favouriteDoctors = [
    {
      id: 1,
      name: 'Dr. Ruby Perrin',
      specialty: 'MDS - Periodontology and Oral Implantology',
      department: 'Dentist',
      image: '/assets/images/doctors/doctor-01.jpg',
      rating: 4.5,
      location: 'Florida, USA',
      fee: '$150',
    },
    {
      id: 2,
      name: 'Dr. Darren Elder',
      specialty: 'BDS, MDS - Oral & Maxillofacial Surgery',
      department: 'Dentist',
      image: '/assets/images/doctors/doctor-02.jpg',
      rating: 4.9,
      location: 'Newyork, USA',
      fee: '$100',
    },
  ];

  return (
    <PatientLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Favourite Doctors</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Favourites</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          {favouriteDoctors.map((doctor) => (
            <div className="col-md-6 col-lg-4" key={doctor.id}>
              <div className="card shadow-sm mb-4">
                <div className="card-body d-flex">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="rounded-circle"
                    width={80}
                    height={80}
                  />
                  <div className="ml-3">
                    <h5 className="mb-1">
                      <Link to={`/doctor/profile/${doctor.id}`}>{doctor.name}</Link>
                    </h5>
                    <p className="mb-1 text-muted">{doctor.specialty}</p>
                    <p className="mb-1"><i className="fas fa-map-marker-alt text-primary me-1"></i> {doctor.location}</p>
                    <p className="mb-1">Fee: <strong>{doctor.fee}</strong></p>
                    <p className="mb-0">
                      Rating: <span className="text-warning">{doctor.rating} <i className="fas fa-star"></i></span>
                    </p>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <Link to={`/doctor/profile/${doctor.id}`} className="btn btn-sm btn-primary mx-1">View Profile</Link>
                  <button className="btn btn-sm btn-danger mx-1">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default Favourites;
