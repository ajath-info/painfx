import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import moment from 'moment'; // For DOB and age formatting
import BASE_URL from '../../config';
import Loader from '../common/Loader';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/patient-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.payload?.patient) {
        setProfile(response.data.payload.patient);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const calculateAge = (dob) => {
    return moment().diff(moment(dob), 'years');
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="text-center py-5"><Loader/></div>
      </PatientLayout>
    );
  }

  if (!profile) {
    return (
      <PatientLayout>
        <div className="text-center py-5 text-danger">Failed to load profile</div>
      </PatientLayout>
    );
  }

  const {
    prefix,
    f_name,
    l_name,
    email,
    phone,
    DOB,
    gender,
    profile_image,
    city,
    country,
  } = profile;

  const fullName = `${prefix || ''} ${f_name || ''} ${l_name || ''}`.trim();
  const formattedDOB = DOB ? `${moment(DOB).format('DD MMM YYYY')}, ${calculateAge(DOB)} years` : '';
  const location = `${city || ''}${city && country ? ', ' : ''}${country || ''}`;
  const image = profile_image || '/assets/images/patient-avatar.jpg';

  return (
    <PatientLayout>
      <div className="card">
        <div className="card-header">
          <h4>Patient Profile</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Avatar */}
            <div className="col-md-3 text-center">
              <img
                src={image}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h5 className="mt-3">{fullName}</h5>
              <p className="text-muted">{formattedDOB}</p>
              <p>{location}</p>
            </div>

            {/* Info */}
            <div className="col-md-9">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row">Email:</th>
                    <td>{email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone:</th>
                    <td>{phone}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gender:</th>
                    <td>{gender}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address:</th>
                    <td>{location}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientProfile;
