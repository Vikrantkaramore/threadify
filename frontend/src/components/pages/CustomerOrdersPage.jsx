import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import styles from './AuthPage.module.css'; // Reusing auth page styles for consistency

const CustomerOrdersPage = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

    // Mock order data - in a real app, this would fetch from API
    const mockOrders = [
      { id: 1, service: 'Custom Suit', status: 'In Progress', date: '2023-10-01', tailor: 'John Doe' },
      { id: 2, service: 'Shirt Alteration', status: 'Completed', date: '2023-09-15', tailor: 'Jane Smith' },
      { id: 3, service: 'Pants Hemming', status: 'Pending', date: '2023-10-05', tailor: 'Mike Johnson' },
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <BlurText text={`Your Orders, ${user.name || 'Customer'}!`} delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Track and manage all your tailoring orders in one place.
          </p>
        </header>

        <div className={styles.dashboardContent}>
          {/* Orders Section */}
          <section className={styles.section}>
            <h2>Your Orders</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <h3>{order.service}</h3>
                    <p><strong>Tailor:</strong> {order.tailor}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <button className={`${styles.bookButton} card-nav-cta-button`}>View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet. <Link to="/services">Book your first service!</Link></p>
            )}
          </section>

          {/* Actions Section */}
          <section className={styles.section}>
            <h2>Quick Actions</h2>
            <div className={styles.actions}>
              <Link to="/dashboard/customer" className={`${styles.actionButton} card-nav-cta-button`}>Back to Dashboard</Link>
              <Link to="/services" className={`${styles.actionButton} card-nav-cta-button`}>Book New Service</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
