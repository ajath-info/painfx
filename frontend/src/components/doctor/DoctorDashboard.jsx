import React from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import UpcomingAppointments from './Appointments';
import TodaysSchedule from './ScheduleTimings';
import EarningsChart from './EarningsChart';


const DoctorDashboard = () => {
  return (
    <DoctorLayout>
      <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg1"><i className="fa fa-user-o" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>120</h3>
              <span className="widget-title1">Patients <i className="fa fa-check" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg2"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>25</h3>
              <span className="widget-title2">Appointments <i className="fa fa-check" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg3"><i className="fa fa-credit-card" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>$2,500</h3>
              <span className="widget-title3">Earnings <i className="fa fa-check" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg4"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>10</h3>
              <span className="widget-title4">Today’s Schedule <i className="fa fa-check" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-lg-6">
          <EarningsChart />
        </div>
        <div className="col-md-6 col-lg-6">
          <TodaysSchedule />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <UpcomingAppointments />
        </div>
      </div>
      
    </DoctorLayout>
  );
};

export default DoctorDashboard;
