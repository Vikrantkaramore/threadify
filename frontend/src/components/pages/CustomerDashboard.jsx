import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import { FaUserCircle, FaBell, FaComments } from 'react-icons/fa';
import styles from './AuthPage.module.css'; 

const CustomerDashboard = () => {
  const [user, setUser] = useState({});
  // This state controls the animation classes
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // This state controls if the component is in the DOM
  const [isDropdownMounted, setDropdownMounted] = useState(false);
  const [tailors, setTailors] = useState([]);
  const [inputValue, setInputValue] = useState(''); // For immediate input value
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

    // Fetch tailors
    fetchTailors();
  }, []);

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

  // Debounce effect for search
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300); // Wait for 300ms of inactivity before setting the search term

    // Cleanup function to clear the timeout if the user types again
    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]); // This effect runs whenever the immediate input value changes

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

  const fetchTailors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tailors');
      const data = await response.json();
      if (response.ok) {
        setTailors(data.tailors);
      }
    } catch (error) {
      console.error('Error fetching tailors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also remove token if you store it
    navigate('/login');
  };

  const handleBookService = async (tailorId, serviceType = 'General Service') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a service');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tailor_id: tailorId,
          service_type: serviceType,
          notes: 'Booked from dashboard'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Service booked successfully! The tailor will be notified.');
      } else {
        alert(`Error booking service: ${data.error}`);
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service. Please try again.');
    }
  };



  const filteredTailors = tailors.filter(tailor =>
    tailor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tailor.business_name && tailor.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tailor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <BlurText text={`Welcome back, ${user.name || 'Customer'}!`} delay={150} className={styles.heading} />
          <p className={styles.subtext}>
            Manage your profile, view orders, and book new tailoring services.
          </p>
        </header>

        <div className={styles.dashboardContent}>
          {/* Available Tailors Section */}
          <section className={`${styles.section} ${styles.tailorsSection}`}>
            <h2>Available Tailors</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name, business, or email..."
                className={styles.searchBar}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            {loading ? (
              <p>Loading tailors...</p>
            ) : filteredTailors.length > 0 ? (
              <div className={styles.tailorsList}>
                {filteredTailors.map(tailor => (
                  <div key={tailor._id} className={styles.tailorCard}>
                    <h3>{tailor.name}</h3>
                    {(tailor.businessName || tailor.business_name) && (
                      <p><strong>Business:</strong> {tailor.businessName || tailor.business_name}</p>
                    )}
                    <p><strong>Email:</strong> {tailor.email}</p>
                    {tailor.phone && <p><strong>Phone:</strong> {tailor.phone}</p>}
                    <button onClick={() => handleBookService(tailor._id)} className={`${styles.bookButton} card-nav-cta-button`}>Book Service</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tailors found matching your search.</p>
            )}
          </section>

          {/* Actions Section */}
          <section className={styles.section}>
            <h2>Quick Actions</h2>
            <div className={styles.actions}>
              <Link to="/services" className={`${styles.actionButton} card-nav-cta-button`}>Book New Service</Link>
              <Link to="/contact" className={`${styles.actionButton} card-nav-cta-button`}>Contact Support</Link>
            </div>
          </section>
        </div>
      </div>
  );
};

export default CustomerDashboard;
