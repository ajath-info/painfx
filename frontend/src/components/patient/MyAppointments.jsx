import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const Appointments = () => {
  return (
    <PatientLayout>
      <h3>My Appointments</h3>
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Speciality</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Ruby Perrin</td>
              <td>Dental</td>
              <td>08 Jul 2025</td>
              <td>10:00 AM</td>
              <td><span className="badge bg-success">Confirmed</span></td>
              <td><button className="btn btn-sm btn-danger">Cancel</button></td>
            </tr>
            <tr>
              <td>Dr. Darren Elder</td>
              <td>Cardiology</td>
              <td>04 Jul 2025</td>
              <td>2:00 PM</td>
              <td><span className="badge bg-danger">Cancelled</span></td>
              <td><button className="btn btn-sm btn-outline-primary">Reschedule</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </PatientLayout>
  );
};

export default Appointments;
