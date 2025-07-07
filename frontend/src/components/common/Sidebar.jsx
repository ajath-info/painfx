import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">Main</li>
            <li className={isActive('/doctor/dashboard')}>
              <Link to="/doctor/dashboard"><i className="fa fa-dashboard"></i> <span>Dashboard</span></Link>
            </li>
            <li className={isActive('/doctor/appointments')}>
              <Link to="/doctor/appointments"><i className="fa fa-calendar-check-o"></i> <span>Appointments</span></Link>
            </li>
            <li className={isActive('/doctor/patients')}>
              <Link to="/doctor/patients"><i className="fa fa-user"></i> <span>My Patients</span></Link>
            </li>
            <li className={isActive('/doctor/schedule')}>
              <Link to="/doctor/schedule"><i className="fa fa-clock-o"></i> <span>Schedule Timings</span></Link>
            </li>
            <li className={isActive('/doctor/profile')}>
              <Link to="/doctor/profile"><i className="fa fa-user-md"></i> <span>Profile Settings</span></Link>
            </li>
            <li>
              <Link to="/logout"><i className="fa fa-sign-out"></i> <span>Logout</span></Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
