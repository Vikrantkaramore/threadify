import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const TermsOfServicePage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Terms of Service</h1>
          <p className={styles.subtext}>Read the basic terms that govern use of Threadify services.</p>
        </header>

        <div className={styles.section}>
          <p>By using Threadify, you agree to our terms and conditions, including:</p>
          <ul>
            <li>Respecting other users and service providers.</li>
            <li>Using the platform only for lawful purposes.</li>
            <li>Keeping your account credentials secure.</li>
          </ul>
          <p>We may update these terms from time to time. Continued use of our service indicates acceptance.</p>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.actionButton}>Back to Home</Link>
          <Link to="/privacy-policy" className={styles.actionButton}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
