import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Register';
import PatientDashboard from '../components/patient/PatientDashboard';
import Favourites from '../components/patient/Favourites';
import PatientProfile from '../components/patient/PatientProfile';
import Appointments from '../components/patient/MyAppointments';
import MedicalRecords from '../components/patient/MedicalRecords';
import Invoices from '../components/patient/Invoices';
import ProfileSettings from '../components/patient/ProfileSettings';
import ChangePassword from '../components/patient/ChangePassword';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import Appointment from '../components/doctor/Appointments';
import AdminDashboard from '../components/admin/AdminDashboard';
import NotFound from '../pages/NotFound';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/profile-info" element={<PatientProfile />} />
      <Route path="/patient/favourites" element={<Favourites />} />
      <Route path="/patient/appointments" element={<Appointments />} />
      <Route path="/patient/medical-records" element={<MedicalRecords />} />
      <Route path="/patient/invoices" element={<Invoices />} />
      <Route path="/patient/profile" element={<ProfileSettings />} />
      <Route path="/patient/change-password" element={<ChangePassword />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/doctor/appointments" element={<Appointment />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
