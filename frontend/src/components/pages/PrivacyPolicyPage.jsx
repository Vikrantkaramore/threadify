import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Privacy Policy</h1>
          <p className={styles.subtext}>Your privacy matters to us. Here is how we handle your information.</p>
        </header>

        <div className={styles.section}>
          <p>Threadify collects only the minimum information required to deliver our services.</p>
          <p>We do not sell your personal data to third parties. We use your data to:</p>
          <ul>
            <li>Authenticate your account</li>
            <li>Personalize your experience</li>
            <li>Support customer service requests</li>
          </ul>
          <p>If you have any questions about your privacy, please contact support@threadify.in.</p>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.actionButton}>Back to Home</Link>
          <Link to="/terms-of-service" className={styles.actionButton}>Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
