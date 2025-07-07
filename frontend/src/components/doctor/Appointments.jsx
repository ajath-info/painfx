import React from 'react';

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      patient: 'Richard Wilson',
      date: '11 Nov 2025',
      time: '10:00am - 10:15am',
      purpose: 'General Checkup',
      type: 'New Patient',
      image: '/assets/img/patients/patient1.jpg',
    },
    {
      id: 2,
      patient: 'Charlene Reed',
      date: '12 Nov 2025',
      time: '11:00am - 11:30am',
      purpose: 'Dental Exam',
      type: 'Old Patient',
      image: '/assets/img/patients/patient2.jpg',
    },
    // Add more fake or real appointments here
  ];

  return (
    <div className="card card-table">
      <div className="card-header">
        <h4 className="card-title">Upcoming Appointments</h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appt Date</th>
                <th>Purpose</th>
                <th>Type</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <h2 className="table-avatar">
                      <img className="avatar-img rounded-circle" src={appt.image} alt={appt.patient} width="30" />
                      <span>{appt.patient}</span>
                    </h2>
                  </td>
                  <td>
                    {appt.date} <span className="d-block text-info">{appt.time}</span>
                  </td>
                  <td>{appt.purpose}</td>
                  <td>{appt.type}</td>
                  <td className="text-right">
                    <div className="table-action">
                      <a href="#" className="btn btn-sm bg-info-light">
                        <i className="fa fa-eye"></i> View
                      </a>
                      <a href="#" className="btn btn-sm bg-success-light">
                        <i className="fa fa-check"></i> Accept
                      </a>
                      <a href="#" className="btn btn-sm bg-danger-light">
                        <i className="fa fa-times"></i> Cancel
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
