import React from 'react';

const TodaysSchedule = () => {
  const schedule = [
    {
      id: 1,
      patient: 'Richard Wilson',
      time: '10:00am - 10:15am',
      image: '/assets/img/patients/patient1.jpg',
    },
    {
      id: 2,
      patient: 'Charlene Reed',
      time: '11:30am - 12:00pm',
      image: '/assets/img/patients/patient2.jpg',
    },
    {
      id: 3,
      patient: 'Travis Trimble',
      time: '1:00pm - 1:30pm',
      image: '/assets/img/patients/patient3.jpg',
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Today’s Schedule</h4>
      </div>
      <div className="card-body pt-0">
        <ul className="appointment-list">
          {schedule.map((item) => (
            <li key={item.id}>
              <div className="appointment-user">
                <img className="avatar" src={item.image} alt={item.patient} />
              </div>
              <div className="appointment-info">
                <div className="title">{item.patient}</div>
                <div className="time">{item.time}</div>
              </div>
              <div className="appointment-action">
                <a href="#" className="btn btn-sm bg-info-light">
                  <i className="fa fa-eye"></i> View
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodaysSchedule;
