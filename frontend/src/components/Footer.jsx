import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiClock, FiMapPin, FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './Footer.module.css';
import siteLogo from '../assets/logo.png';


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} content-wrapper`}>
        <div className={styles.footerGrid}>
          {/* Brand Section */}
          <div className={styles.footerBrand}>
            <img src={siteLogo} alt="Threadify Logo" className={styles.footerLogo} />
            <h4 className={styles.brandName}>Threadify</h4>
            <p className={styles.tagline}>Crafting confidence, one stitch at a time.</p>
            <p className={styles.footerDescription}>
              Your trusted partner for tailoring, alterations, and custom designs — made with love and delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login/customer">Login (Customers)</Link></li>
              <li><Link to="/login/tailor">Login (Tailors)</Link></li>
              <li><Link to="/signup/tailor">Become a Tailor Partner</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Customer Support</h4>
            <ul className={styles.contactList}>
              <li><FiPhone /> <a href="tel:+917391907186  ">+91 7391907186</a></li>
              <li><FiMail /> <a href="mailto:support@threadify.in">support@threadify.in</a></li>
              <li><FiClock /> Mon–Sat: 9 AM – 7 PM</li>
              <li><FiMapPin /> Nagpur, India</li>
            </ul>
            <h4 className={`${styles.columnTitle} ${styles.followTitle}`}>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
              <a href="https://www.linkedin.com/in/vikrant-karamore-4b8b78257/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          {/* Legal */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Legal</h4>
            <ul className={styles.linkList}>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy">Refund & Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.finalTagline}>
            “Every stitch tells a story. Thank you for letting us be part of yours.”
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;