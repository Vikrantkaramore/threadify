import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BlurText from '../../ui/BlurText';
import styles from './AuthPage.module.css'; // Using the shared Auth page styles

const TailorSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Registration successful! Welcome to Threadify Partner Network.');
        // Redirect to dashboard or home page
        window.location.href = '/';
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div className={`${styles.page} content-wrapper`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <BlurText text="Join the Threadify Partner Network" delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Register as a Master Tailor to connect with customers and grow your business.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Enter your business email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
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
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="businessName"
              placeholder="Your shop or business name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Your contact number"
              value={formData.phone}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={`${styles.submitButton} card-nav-cta-button`}>Register as a Partner</button>
        </form>

        <footer className={styles.footer}>
          <p>Already a partner? <Link to="/login/tailor" className={styles.footerLink}>Log In</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default TailorSignupPage;