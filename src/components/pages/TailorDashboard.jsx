import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import styles from './TailorDashboard.module.css';

const mockOrders = [
  { id: 1, service: 'Suit Alteration', customer: 'John Doe', status: 'Pending', date: '2023-10-01' },
  { id: 2, service: 'Dress Hemming', customer: 'Jane Smith', status: 'In Progress', date: '2023-10-02' },
];

const TailorDashboard = () => {
  const [user, setUser] = useState({});
  // This state controls the animation classes
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // This state controls if the component is in the DOM
  const [isDropdownMounted, setDropdownMounted] = useState(false);

  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0 });
  const [metrics, setMetrics] = useState({ completedOrders: 0, averageRating: 0, responseTime: 'N/A' });
  const [notifications, setNotifications] = useState([]);

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

    // Fetch data
    fetchOrders();
    fetchEarnings();
    fetchMetrics();
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
      // A tiny delay to allow the component to mount before adding the 'open' class
      setTimeout(() => setDropdownOpen(true), 10);
    } else {
      setDropdownOpen(false);
      // Wait for the animation to finish before unmounting
      setTimeout(() => setDropdownMounted(false), 200); // Should match transition duration
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also remove token if you store it
    navigate('/login');
  };

  const fetchOrders = async () => {
    setOrders(mockOrders);
  };

  const fetchEarnings = async () => {
    // Mock earnings
    setEarnings({ total: 1250, thisMonth: 450 });
  };

  const fetchMetrics = async () => {
    // Mock metrics
    setMetrics({ completedOrders: 15, averageRating: 4.8, responseTime: '2 hours' });
  };

  return (
    <div className={styles.page}>
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <div className={styles.notificationIconContainer}>
              <Link to="/notifications" className={styles.notificationIcon}>
                <FaBell size={32} />
                {notifications.length > 0 && (
                  <span className={styles.notificationBadge}>
                    {notifications.length > 99 ? '99+' : notifications.length}
                  </span>
                )}
              </Link>
            </div>
            <div className={styles.profileIconContainer} ref={dropdownRef} >
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
          <BlurText text={`Welcome back, ${user.name || 'Tailor'}!`} delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Empower your craft, manage your business, and delight your customers with Threadify.
          </p>
        </header>

        <div className={styles.dashboardContent}>
          {/* Orders Section */}
          <section className={styles.section}>
            <h2>Received Orders</h2>
            <p className={styles.helpText}>Manage your incoming orders and keep your customers satisfied.</p>
            {orders.length > 0 ? (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <h3>{order.service}</h3>
                    <p><strong>Customer:</strong> {order.customer}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <button className={`${styles.bookButton} card-nav-cta-button`} title="View and update order details">View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet. Your first order is just around the corner!</p>
            )}
          </section>

          {/* Earnings Section */}
          <section className={styles.section}>
            <h2>Earnings</h2>
            <p className={styles.helpText}>Track your financial success and plan for growth.</p>
            <div className={styles.earningsInfo}>
              <p><strong>Total Earnings:</strong> ${earnings.total}</p>
              <p><strong>This Month:</strong> ${earnings.thisMonth}</p>
              <button className={`${styles.actionButton} card-nav-cta-button`} title="View detailed earnings report">View Report</button>
            </div>
          </section>

          {/* Metrics Section */}
          <section className={styles.section}>
            <h2>Performance Metrics</h2>
            <p className={styles.helpText}>Monitor your success and identify areas for improvement.</p>
            <div className={styles.metricsInfo}>
              <p><strong>Completed Orders:</strong> {metrics.completedOrders}</p>
              <p><strong>Average Rating:</strong> {metrics.averageRating}/5</p>
              <p><strong>Average Response Time:</strong> {metrics.responseTime}</p>
              <button className={`${styles.actionButton} card-nav-cta-button`} title="Explore detailed analytics">View Analytics</button>
            </div>
          </section>

          {/* Chat Section */}
          <section className={styles.section}>
            <h2>Customer Chat</h2>
            <p className={styles.helpText}>Communicate directly with your customers for better service.</p>
            <div className={styles.chatInfo}>
              <p>Active conversations: 3</p>
              <button className={`${styles.actionButton} card-nav-cta-button`} title="Open chat interface">Open Chat</button>
            </div>
          </section>



          {/* Support Section */}
          <section className={styles.section}>
            <h2>Support & Help</h2>
            <p className={styles.helpText}>We're here to support your success. Reach out anytime.</p>
            <div className={styles.supportActions}>
              <Link to="/contact" className={`${styles.actionButton} card-nav-cta-button`} title="Contact our support team">Contact Support</Link>
              <button className={`${styles.actionButton} card-nav-cta-button`} title="Access help resources">Help Center</button>
            </div>
          </section>

          {/* Actions Section */}
          <section className={styles.section}>
            <h2>Quick Actions</h2>
            <div className={styles.actions}>
              <Link to="/services" className={`${styles.actionButton} card-nav-cta-button`} title="Update your service offerings">Manage Services</Link>
              <Link to="/pricing" className={`${styles.actionButton} card-nav-cta-button`} title="Adjust your pricing">Update Pricing</Link>
            </div>
          </section>
        </div>
      </div>
  );
};

export default TailorDashboard;
