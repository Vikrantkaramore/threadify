import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const RefundPolicyPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Refund & Cancellation Policy</h1>
          <p className={styles.subtext}>Learn about our refund policy and cancellation process.</p>
        </header>

        <div className={styles.section}>
          <p>Refund requests are evaluated on a case-by-case basis. In general:</p>
          <ul>
            <li>Bookings can be cancelled before service initiation for a full refund.</li>
            <li>Once a service has started, partial or no refund may apply.</li>
            <li>Refunds are processed within 5-7 business days after approval.</li>
          </ul>
          <p>If you need help, please contact support@threadify.in.</p>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.actionButton}>Back to Home</Link>
          <Link to="/contact" className={styles.actionButton}>Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
