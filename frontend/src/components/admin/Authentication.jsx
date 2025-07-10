import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

const Authentication = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<div className="text-center mt-20 text-2xl text-red-500">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default Authentication;
