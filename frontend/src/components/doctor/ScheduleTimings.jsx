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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">Today’s Schedule</h4>
      <ul className="space-y-4">
        {schedule.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100">
            
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.patient}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.patient}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-cyan-600 border border-cyan-600 rounded hover:bg-cyan-600 hover:text-white transition"
            >
              <i className="fa fa-eye mr-1"></i> View
            </a>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodaysSchedule;
