import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="row">
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i className="fa fa-user-md"></i>
                </span>
                <div className="dash-count">
                  <h3>150</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Doctors</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-primary" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-success">
                  <i className="fa fa-user"></i>
                </span>
                <div className="dash-count">
                  <h3>200</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Patients</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-danger border-danger">
                  <i className="fa fa-calendar"></i>
                </span>
                <div className="dash-count">
                  <h3>180</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Appointments</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-danger" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-warning border-warning">
                  <i className="fa fa-money"></i>
                </span>
                <div className="dash-count">
                  <h3>$25K</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Earnings</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-warning" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
