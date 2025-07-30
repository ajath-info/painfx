import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import all your existing components
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Register';
import NotFound from '../pages/NotFound';
import Faqs from '../components/home/Faqs';
import Cancellation from '../components/home/Cancellation';
import Disclaimer from '../components/home/Disclaimer';
import PrivacyPolicy from '../components/home/Privacypolicy';
import Termsandcondition from '../components/home/Termsandcondition';
import SearchDoctorList from '../components/home/SearchDoctorList'
import Blog from '../components/home/Blog';
import BlogDetail from '../components/home/BlogDetail';
import ForgotPasswordpage  from '../pages/ForgotPassword';
import CheckValidation from '../pages/Checkvalidation';

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
import PaymentOption from '../components/patient/PaymentOption';
import PaymentSuccess from '../components/patient/PaymentSuccess';
import PaymentFailure from '../components/patient/PaymentFailure';
import AppointmentDetails from '../components/patient/AppointmentDetails';
import ProfileView from '../components/patient/profileView';

// Doctor Components
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import DoctorAppointments from '../components/doctor/Appointments';
import DoctorProfile from '../components/doctor/DoctorProfile';
import DoctorProfileForm from '../components/doctor/DoctorProfileForm';
import DoctorScheduleTimings from '../components/doctor/ScheduleTimings';
import DoctorInvoice from '../components/doctor/invoice';
import DoctorReviews from '../components/doctor/Reviews';
import Mypatients from '../components/doctor/patients';
import DoctorAppointmentDetails from '../components/doctor/appointmentView';
import AddPrescription from '../components/doctor/AddPrescription';

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
import AdminClinic from '../components/admin/AdminClinic';
import AdminAppointmentDetails from '../components/admin/appointmentView';
import Ctasection from '../components/admin/Ctasection';
import Gdprsection from '../components/admin/Gdprsection';

// Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // Optional: Validate token if you have one stored separately
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (token) {
          // Validate token with your API (optional)
          try {
            const response = await fetch('/api/me', {
              headers: { 
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              setUser(parsedUser);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              localStorage.removeItem('authToken');
            }
          } catch {
            // If API call fails, still use stored user data
            setUser(parsedUser);
          }
        } else {
          // No token but user data exists, use stored data
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid data
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, expectedRole = null) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store user data in localStorage as "user"
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    userRole: user?.role // Access role from user object
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized component
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
    <p className="mb-4">You don't have permission to access this page.</p>
    <button 
      onClick={() => window.history.back()}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go Back
    </button>
  </div>
);

// Main App Router with Protection
const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Semi-Public Routes (accessible but might need basic auth check) */}
          <Route 
            path="/faqs" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Faqs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SearchDoctorList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Blog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog/:id" 
            element={
              <ProtectedRoute requireAuth={false}>
                <BlogDetail />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/terms-and-conditions" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Termsandcondition />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cancellations" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Cancellation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forget-password-page" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordpage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/check-validation" 
            element={
              <ProtectedRoute requireAuth={false}>
                <CheckValidation />
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/Disclaimer" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Disclaimer/>
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/Privacy-Policy" 
            element={
              <ProtectedRoute requireAuth={false}>
                <PrivacyPolicy />
              </ProtectedRoute>
            } 
          />

          {/* Patient Routes - Only accessible by patients */}
          <Route 
            path="/patient/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/profile-info" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/profile-view" 
            element={
               <ProfileView />
            } 
          />
          <Route 
            path="/patient/favourites" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Favourites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/appointments" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Appointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/medical-records" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicalRecords />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/invoices" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Invoices />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/patient/appointment/details" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AppointmentDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/profile-setting" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/change-password" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/booking" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookingSlot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/book-appointment" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/payment-option" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PaymentOption />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PaymentSuccess />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/payment-cancelled" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PaymentFailure />
              </ProtectedRoute>
            } 
          />

          {/* Doctor Routes - Only accessible by doctors */}
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/profile" 
            element={
              // <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfile />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/profile-form" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfileForm />
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/doctor/prescription" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AddPrescription />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/schedule" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorScheduleTimings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/invoice" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorInvoice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/reviews" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorReviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/patients" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Mypatients />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointment/details"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointmentDetails />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes - Only accessible by admins */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/appointments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <AppointmentsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/specialities" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <Specialities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <DoctorsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/patients" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <PatientsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <Reviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/transactions" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/clinic" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminClinic />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/admin-profile" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/authentication" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Authentication />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Auth Routes - These might be public for admin registration */}
          <Route path="/admin/auth/login" element={<LoginPage />} />
          <Route path="/admin/auth/register" element={<Register />} />
          <Route path="/admin/auth/forgot-password" element={<ForgotPassword />} />
          
          <Route 
            path="/admin/partner" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Partner />
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/admin/ctasecton" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Ctasection />
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/admin/gdprsection" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Gdprsection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/faqs" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFaqs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/appointment/details"
            element={
              <ProtectedRoute allowedRoles={['admin', 'clinic']}>
                <AdminAppointmentDetails />
              </ProtectedRoute>
            } 
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRouter;