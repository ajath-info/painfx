import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';

const PatientDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['appointments', 'prescriptions', 'records', 'billing'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);

  const appointments = [
    {
      doctor: 'Dr. Ruby Perrin',
      speciality: 'Dental',
      avatar: '/assets/images/doctors/doctor-01.jpg',
      apptDate: '14 Nov 2019',
      apptTime: '10.00 AM',
      bookingDate: '12 Nov 2019',
      amount: '$160',
      followUp: '16 Nov 2019',
      status: 'Confirm',
    },
    {
      doctor: 'Dr. Darren Elder',
      speciality: 'Dental',
      avatar: '/assets/images/doctors/doctor-02.jpg',
      apptDate: '12 Nov 2019',
      apptTime: '8.00 PM',
      bookingDate: '12 Nov 2019',
      amount: '$250',
      followUp: '14 Nov 2019',
      status: 'Pending',
    },
  ];

  const prescriptions = [
    { doctor: 'Dr. Ruby Perrin', date: '14 Nov 2019', prescriptionId: '#RX001' },
    { doctor: 'Dr. Darren Elder', date: '12 Nov 2019', prescriptionId: '#RX002' },
  ];

  const medicalRecords = [
    { title: 'MRI Brain', date: '10 Nov 2019', type: 'MRI', size: '3MB' },
    { title: 'X-Ray Chest', date: '09 Nov 2019', type: 'X-Ray', size: '1.5MB' },
  ];

  const billing = [
    { invoiceId: '#INV001', date: '14 Nov 2019', amount: '$160' },
    { invoiceId: '#INV002', date: '12 Nov 2019', amount: '$250' },
  ];

  const renderStatusBadge = (status) => {
    const map = {
      confirm: 'success',
      cancelled: 'danger',
      pending: 'warning',
    };
    return <span className={`badge badge-${map[status.toLowerCase()] || 'secondary'}`}>{status}</span>;
  };

  return (
    <PatientLayout>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center my-4">
          <h3 className="mb-0">Dashboard</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                  Appointments
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>
                  Prescriptions
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
                  Medical Records
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
                  Billing
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Appointments */}
              {activeTab === 'appointments' && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Appt Date</th>
                        <th>Booking Date</th>
                        <th>Amount</th>
                        <th>Follow Up</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt, i) => (
                        <tr key={i}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img src={appt.avatar} alt="doc" className="rounded-circle" width={40} height={40} />
                              <div className="ml-2">
                                <strong>{appt.doctor}</strong><br />
                                <small>{appt.speciality}</small>
                              </div>
                            </div>
                          </td>
                          <td>{appt.apptDate}<br /><small className="text-primary">{appt.apptTime}</small></td>
                          <td>{appt.bookingDate}</td>
                          <td>{appt.amount}</td>
                          <td>{appt.followUp}</td>
                          <td>{renderStatusBadge(appt.status)}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary mr-2">Print</button>
                            <button className="btn btn-sm btn-outline-success">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prescriptions */}
              {activeTab === 'prescriptions' && (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Prescription ID</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((presc, i) => (
                        <tr key={i}>
                          <td>{presc.prescriptionId}</td>
                          <td>{presc.doctor}</td>
                          <td>{presc.date}</td>
                          <td><button className="btn btn-sm btn-outline-info">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Medical Records */}
              {activeTab === 'records' && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicalRecords.map((rec, i) => (
                        <tr key={i}>
                          <td>{rec.title}</td>
                          <td>{rec.date}</td>
                          <td>{rec.type}</td>
                          <td>{rec.size}</td>
                          <td><button className="btn btn-sm btn-outline-primary">Download</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billing.map((bill, i) => (
                        <tr key={i}>
                          <td>{bill.invoiceId}</td>
                          <td>{bill.date}</td>
                          <td>{bill.amount}</td>
                          <td><button className="btn btn-sm btn-outline-dark">PDF</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
