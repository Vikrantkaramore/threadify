import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>My Profile</h1>
          <p className={styles.subtext}>Review and update your account details.</p>
        </header>

        <div className={styles.section}>
          <p><strong>Name:</strong> {user.name || 'Guest'}</p>
          <p><strong>Email:</strong> {user.email || 'Not available'}</p>
          <p><strong>Role:</strong> {user.role || 'N/A'}</p>
          <p><strong>Joined:</strong> {user.joined || 'N/A'}</p>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.actionButton}>Go Home</Link>
          <Link to="/settings" className={styles.actionButton}>Account Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
