import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BlurText from '../../ui/BlurText';
import styles from './AuthPage.module.css';

const TailorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login/tailor', {
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
        alert('Login successful! Welcome back to Threadify Partner Network.');
        // Redirect to tailor dashboard
        window.location.href = '/dashboard/tailor';
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
          <BlurText text="Welcome Back, Master Tailor." delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Log in to manage customer requests, track orders, and grow your tailoring business.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
          </div>

          <button type="submit" className={`${styles.submitButton} card-nav-cta-button`}>Log In to Dashboard</button>

          <div className={styles.divider}>or</div>

          <button type="button" className={styles.socialButton}>
            <FcGoogle /> Continue with Google
          </button>
        </form>

        <footer className={styles.footer}>
          <p className={styles.tagline}>“Empowering tailors, one stitch at a time.”</p>
          <p>Not a partner yet? <Link to="/signup/tailor" className={styles.footerLink}>Join Now</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default TailorLoginPage;