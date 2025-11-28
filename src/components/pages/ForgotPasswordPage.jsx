import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import styles from './AuthPage.module.css'; // Reusing styles for consistency

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Optionally parse the error response and surface it (do not create an unused variable)
        // const err = await response.json();
        // setError(err?.message || 'Error sending reset link.');
        console.warn('Forgot password request failed with status:', response.status);
      }
    } catch (err) {
      // Handle network/server error
      console.error('Forgot password request failed:', err);
    }
  };

  return (
    <div className={`${styles.page} content-wrapper`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <BlurText text="Forgot Your Password?" delay={150} className={styles.heading} />
          {isSubmitted ? (
            <p className={styles.subtext}>
              If an account exists for {email}, you will receive an email with instructions on how to reset your password.
            </p>
          ) : (
            <p className={styles.subtext}>
              No problem. Enter your email address below and we'll send you a link to reset it.
            </p>
          )}
        </header>

        {!isSubmitted && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
            <button type="submit" className={`${styles.submitButton} card-nav-cta-button`}>Send Reset Link</button>
          </form>
        )}

        <footer className={styles.footer}>
          <p><Link to="/login" className={styles.footerLink}>Back to Sign In</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;