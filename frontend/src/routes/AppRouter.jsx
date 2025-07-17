import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Register';
import NotFound from '../pages/NotFound';
import Faqs from '../components/home/Faqs';

// Patient Components
import PatientDashboard from '../components/patient/PatientDashboard';
import Favourites from '../components/patient/Favourites';
import PatientProfile from '../components/patient/PatientProfile';
import Appointments from '../components/patient/MyAppointments';
import MedicalRecords from '../components/patient/MedicalRecords';
import Invoices from '../components/patient/Invoices';
import ProfileSettings from '../components/patient/ProfileSettings';
import ChangePassword from '../components/patient/ChangePassword';
import BookingSlot from '../components/patient/BookingSlot';
import BookAppointment from '../components/patient/BookAppointment';
import PaymentOption from '../components/patient/PaymentOption'

// Doctor Components
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import DoctorAppointments from '../components/doctor/Appointments';
import DoctorProfile from '../components/doctor/DoctorProfile';
import DoctorProfileForm from '../components/doctor/DoctorProfileForm';
import DoctorScheduleTimings from '../components/doctor/ScheduleTimings';
import DoctorInvoice from '../components/doctor/invoice';
import DoctorReviews from '../components/doctor/Reviews';
import Mypatients from '../components/doctor/patients';

// Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import Specialities from '../components/admin/Specialities';
import DoctorsManagement from '../components/admin/DoctorsManagement';
import PatientsManagement from '../components/admin/PatientsManagement';
import Settings from '../components/admin/Settings';
import Transactions from '../components/admin/Transactions';
import AppointmentsManagement from '../components/admin/AppointmentsManagement';
import Reports from '../components/admin/Reports';
import Reviews from '../components/admin/Reviews';
import Authentication from '../components/admin/Authentication';
import AdminProfile from '../components/admin/AdminProfile';
import LoginPage from '../components/admin/LoginPage';
import Register from '../components/admin/Register';
import ForgotPassword from '../components/admin/ForgotPassword';
import Partner from '../components/admin/partner';
import AdminFaqs from '../components/admin/AdminFaqs';


const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/faqs" element={<Faqs />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/profile-info" element={<PatientProfile />} />
      <Route path="/patient/favourites" element={<Favourites />} />
      <Route path="/patient/appointments" element={<Appointments />} />
      <Route path="/patient/medical-records" element={<MedicalRecords />} />
      <Route path="/patient/invoices" element={<Invoices />} />
      <Route path="/patient/profile-setting" element={<ProfileSettings />} />
      <Route path="/patient/change-password" element={<ChangePassword />} />
      <Route path="/patient/booking" element={<BookingSlot />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
       <Route path="/patient/payment-option" element={<PaymentOption />} />

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/profile-form" element={<DoctorProfileForm />} />
      <Route path="/doctor/schedule" element={<DoctorScheduleTimings />} />
      <Route path="/doctor/invoice" element={<DoctorInvoice />} />
      <Route path="/doctor/reviews" element={<DoctorReviews />} />
      <Route path="/doctor/patients" element={<Mypatients />} />
      

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/appointments" element={<AppointmentsManagement />} />
      <Route path="/admin/specialities" element={<Specialities />} />
      <Route path="/admin/doctors" element={<DoctorsManagement />} />
      <Route path="/admin/patients" element={<PatientsManagement />} />
      <Route path="/admin/reviews" element={<Reviews />} />
      <Route path="/admin/transactions" element={<Transactions />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/admin-profile" element={<AdminProfile />} />
      <Route path="/admin/authentication" element={<Authentication />} />
      <Route path="/admin/auth/login" element={<LoginPage />} />
      <Route path="/admin/auth/register" element={<Register />} />
      <Route path="/admin/partner" element={<Partner />} />
      <Route path="/admin/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/faqs" element={<AdminFaqs />} />
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
