import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const SettingsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Settings</h1>
          <p className={styles.subtext}>Manage your account preferences and notifications.</p>
        </header>

        <div className={styles.section}>
          <p>Account settings are coming soon. For now, use your account menu to update your profile and preferences.</p>
          <ul>
            <li>Change password</li>
            <li>Manage notifications</li>
            <li>Privacy preferences</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.actionButton}>Return Home</Link>
          <Link to="/profile" className={styles.actionButton}>View Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
