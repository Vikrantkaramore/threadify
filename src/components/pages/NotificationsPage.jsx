import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TailorDashboard.module.css'; 
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';


const NotificationsPage = () => {
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownMounted, setDropdownMounted] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user.id) {
        console.error('No token or user ID found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/notifications/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications || []);
      } else {
        console.error('Error fetching notifications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user.id]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user.id) {
      fetchNotifications();
    }
  }, [user.id, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleDropdownToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleDropdownToggle = (open) => {
    if (open) {
      setDropdownMounted(true);
      setTimeout(() => setDropdownOpen(true), 10);
    } else {
      setDropdownOpen(false);
      setTimeout(() => setDropdownMounted(false), 200);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.profileIconContainer} ref={dropdownRef}>
            <FaUserCircle size={32} className={styles.profileIcon} onClick={() => handleDropdownToggle(!isDropdownOpen)} />
            {isDropdownMounted && (
              <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
                <Link to="/profile" className={styles.dropdownItem}>My Profile</Link>
                <Link to="/settings" className={styles.dropdownItem}>Settings</Link>
                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButtonDropdown}`}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.heading}>Notifications</h1>
        <p className={styles.subtext}>Stay updated on important events and opportunities.</p>
      </header>

      <div className={styles.dashboardContent}>
        <section className={styles.section}>
          {notifications.length > 0 ? (
            <div className={styles.notificationsList}>
              {notifications.map(notification => (
                <div key={notification._id || notification.id} className={styles.notificationCard}>
                  <p>{notification.message}</p>
                  <p><small>{new Date(notification.created_at).toLocaleDateString()}</small></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No new notifications.</p>
          )}
          <div className={styles.notificationActions}>
            <button onClick={fetchNotifications} className={`${styles.actionButton} card-nav-cta-button`} title="Refresh notifications">Refresh</button>
            <button className={`${styles.actionButton} card-nav-cta-button`} title="Mark all as read">Mark All Read</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationsPage;
