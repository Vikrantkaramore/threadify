import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import { FaUserCircle, FaBell, FaComments } from 'react-icons/fa';
import DashboardSection from '../dashboardsection';
import styles from './TailorDashboard.module.css';

const TailorDashboard = () => {
  const [user, setUser] = useState({});
  // This state controls the animation classes
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // This state controls if the component is in the DOM
  const [isDropdownMounted, setDropdownMounted] = useState(false);

  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  const userId = user.id || user._id || null;

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId) {
        console.error('No token or user ID found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/notifications', {
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
  }, [userId]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId) {
        console.error('No token or user ID found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/tailor/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Error fetching orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchOrders();
    }
  }, [userId, fetchNotifications, fetchOrders]);

  // Listen for notification updates from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'notificationsUpdated') {
        fetchNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleNotificationsUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
    };
  }, [fetchNotifications]);

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Order approved successfully!');
        fetchOrders(); // Refresh orders
        setIsModalOpen(false);
      } else {
        alert('Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert('An error occurred while approving the order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Order rejected successfully!');
        fetchOrders(); // Refresh orders
        setIsModalOpen(false);
      } else {
        alert('Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('An error occurred while rejecting the order');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.chatIconContainer}>
            <Link to="/chat" className={styles.chatIcon}>
              <FaComments size={32} />
            </Link>
          </div>
          <div className={styles.notificationIconContainer}>
            <Link to="/notifications" className={styles.notificationIcon}>
              <FaBell size={32} />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className={styles.notificationBadge}>
                  {notifications.filter(n => !n.is_read).length > 99 ? '99+' : notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </Link>
          </div>
          <div className={styles.profileIconContainer} ref={dropdownRef} >
            <FaUserCircle size={32} className={styles.profileIcon} onClick={() => handleDropdownToggle(!isDropdownOpen)} />
            {isDropdownMounted && (
              <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
                <Link to="/notifications" className={styles.dropdownItem}>Notifications</Link>
                <Link to="/dashboard/tailor/support" className={styles.dropdownItem}>Support</Link>
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
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search orders by service, customer, or status..."
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {orders.length > 0 ? (
            <div className={styles.ordersList}>
              {orders.filter(order =>
                order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.status.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <h3>{order.service}</h3>
                  <p><strong>Customer:</strong> {order.customer}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Date:</strong> {order.date}</p>
                  <div className={styles.cardActions}>
                    <button className={`${styles.bookButton} card-nav-cta-button`} onClick={() => handleViewDetails(order)} title="View and update order details">View Details</button>
                    <Link to={`/dashboard/tailor/chat?orderId=${order.id}`} className={`${styles.actionButton} card-nav-cta-button`} title="Open chat for this request">Chat</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet. Your first order is just around the corner!</p>
          )}
        </section>

        {/* Actions Section */}
        <section className={`${styles.section} ${styles.quickActions}`}>
          <div className={styles.actionsAndFolder}>
            <div className={styles.quickActionsContent}>
              <h2>Quick Actions</h2>
              <div className={styles.actions}>
                <Link to="/services" className={`${styles.actionButton} card-nav-cta-button`} title="Update your service offerings">Manage Services</Link>
                <Link to="/orders" className={`${styles.actionButton} card-nav-cta-button`} title="Manage your orders">Manage Orders</Link>
              </div>
            </div>
            <div className={styles.folderContainer}>
              <DashboardSection />
            </div>
          </div>
        </section>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p><strong>Service:</strong> {selectedOrder.service}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            {selectedOrder.description && <p><strong>Description:</strong> {selectedOrder.description}</p>}
            <div className={styles.modalActions}>
              <button className={`${styles.approveButton} card-nav-cta-button`} onClick={() => handleApproveOrder(selectedOrder.id)}>Approve Order</button>
              <button className={`${styles.rejectButton} card-nav-cta-button`} onClick={() => handleRejectOrder(selectedOrder.id)}>Reject Order</button>
              <button className={styles.closeButton} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorDashboard;
