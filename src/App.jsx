import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import CustomerLoginPage from './components/pages/CustomerLoginPage';
import CustomerSignupPage from './components/pages/CustomerSignupPage';
import TailorLoginPage from './components/pages/TailorLoginPage';
import TailorSignupPage from './components/pages/TailorSignupPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ServicesPage from './components/pages/ServicesPage';
import PricingPage from './components/pages/PricingPage';
import ContactPage from './components/pages/ContactPage';
import AboutPage from './components/pages/AboutPage';
import NotFoundPage from './components/pages/NotFoundPage';
import CustomerDashboard from './components/pages/CustomerDashboard';
import TailorDashboard from './components/pages/TailorDashboard';
import CustomerOrdersPage from './components/pages/CustomerOrdersPage';
import NotificationsPage from './components/pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useScrollSmoother } from './hooks/useScrollSmoother2';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Background from './components/Background';



const App = () => {
  // Memoize the config object to prevent re-creating ScrollSmoother on every render.
  const smootherConfig = useMemo(() => ({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5,
    effects: true,
  }), []);

  useScrollSmoother(smootherConfig);

  return (
    <div id="smooth-wrapper" className="app-root">
      <div id="smooth-content">
        <Background />
        <Navigation />
        <main className="relative z-10">
          <Routes>
            {/* Routes with the main layout */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<CustomerLoginPage />} />
            <Route path="/signup" element={<CustomerSignupPage />} />
            <Route path="/partner/login" element={<TailorLoginPage />} />
            <Route path="/partner-signup" element={<TailorSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard/tailor" element={
              <ProtectedRoute allowedRoles={['tailor']}>
                <TailorDashboard />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
