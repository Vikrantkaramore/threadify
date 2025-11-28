import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import BlurText from '../../ui/BlurText';
import styles from './CustomerLoginPage.module.css';

const CustomerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful! Welcome back to Threadify.');
        // Redirect to customer dashboard
        window.location.href = '/dashboard/customer';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className={`${styles.page} content-wrapper`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <BlurText text="Welcome Back to Threadify" delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Log in to explore our tailoring services, book fittings, and manage your wardrobe with ease.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
          </div>

          <button type="submit" className={`${styles.submitButton} card-nav-cta-button`}>Sign In</button>

          <div className={styles.divider}>or</div>

          <div className={styles.socialLogin}>
            <button type="button" className={styles.socialButton}>
              <FcGoogle /> Continue with Google
            </button>
            <button type="button" className={styles.socialButton}>
              <FaApple /> Continue with Apple
            </button>
          </div>
        </form>

        <footer className={styles.footer}>
          <p>Your perfect fit is just one click away. 🪡</p>
          <p>Don’t have an account? <Link to="/signup" className={styles.footerLink}>Sign Up Now</Link></p>
          <p>Are you a partner? <Link to="/partner/login" className={styles.footerLink}>Login as Partner</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default CustomerLoginPage;