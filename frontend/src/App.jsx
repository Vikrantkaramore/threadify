import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import PricingPage from './components/pages/PricingPage';
import ContactPage from './components/pages/ContactPage';

import CustomerOrdersPage from './components/pages/CustomerOrdersPage';
import NotificationsPage from './components/pages/NotificationsPage';
import TailorSupport from './components/pages/TailorSupport';
import TailorEarnings from './components/pages/TailorEarnings';
import CustomerLoginPage from './components/pages/CustomerLoginPage';
import CustomerSignupPage from './components/pages/CustomerSignupPage';
import TailorLoginPage from './components/pages/TailorLoginPage';
import TailorSignupPage from './components/pages/TailorSignupPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import NotFoundPage from './components/pages/NotFoundPage';
import CustomerDashboard from './components/pages/CustomerDashboard';
import TailorDashboard from './components/pages/TailorDashboard';
import TailorChat from './components/pages/TailorChat';
import ChatPage from './components/pages/ChatPage';

import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Background from './components/Background';

const App = () => {
  return (
    <div>
      <Background />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login/customer" element={<CustomerLoginPage />} />
          <Route path="/signup/customer" element={<CustomerSignupPage />} />
          <Route path="/login/tailor" element={<TailorLoginPage />} />
          <Route path="/signup/tailor" element={<TailorSignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard/tailor" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tailor/earnings" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorEarnings />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tailor/chat" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorChat />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tailor/support" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorSupport />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Navigate to="/login/customer" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
};

export default App;
