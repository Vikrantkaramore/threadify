import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TailorSupport.module.css';

const TailorSupport = () => {
  return (
    <div className={styles.dashboardContent}>
      <section className={styles.section}>
        <div className={styles.introSection}>
          <h1 className={styles.mainTitle}>🛟 THREADIFY — SUPPORT & HELP CENTER</h1>
          <h2 className={styles.mainSubtitle}>💬 We're Here to Help You</h2>
          <p className={styles.introText}>
            At Threadify, your experience matters to us. Whether you're a customer booking tailoring services or a tailor managing orders, our support team is always ready to assist you.
            Find quick answers, helpful guides, and direct support options below.
          </p>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>📘 1. Frequently Asked Questions (FAQs)</h3>

          <h4 className={styles.subsectionTitle}>For Customers</h4>
          <div className={styles.faqContainer}>
            <p><strong>How do I book a tailoring or alteration service?</strong><br />Select your service, upload details, choose a pickup time, and confirm your order.</p>
            <p><strong>How can I track my order?</strong><br />Go to My Orders to view live order status updates.</p>
            <p><strong>What if I am not satisfied with the fitting?</strong><br />You can request a free refit within 48 hours of delivery.</p>
            <p><strong>How do payments work?</strong><br />We support secure online payments and cash-on-delivery options in some areas.</p>
            <p><strong>How do I contact the tailor for clarifications?</strong><br />Use the in-app chat available inside the order details page.</p>
          </div>

          <h4 className={styles.subsectionTitle}>For Tailors</h4>
          <div className={styles.faqContainer}>
            <p><strong>How do I accept or decline orders?</strong><br />Go to the New Orders tab and review the request before confirming.</p>
            <p><strong>How are earnings calculated?</strong><br />You earn based on each completed service minus the Threadify service fee.</p>
            <p><strong>When will I receive my payouts?</strong><br />Payouts are processed weekly (every 7 days).</p>
            <p><strong>How can I upload my work samples?</strong><br />You can add photos in the Profile & Portfolio section.</p>
            <p><strong>What if a customer requests changes?</strong><br />Use the in-app chat to discuss details or request additional time.</p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>📞 2. Contact Support</h3>
          <div className={styles.contactContainer}>
            <p>If you need help beyond FAQs, you can reach us anytime:</p>
            <p><strong>📧 Email:</strong> support@threadify.in</p>
            <p><strong>💬 In-App Chat:</strong> Available 9 AM – 9 PM</p>
            <p><strong>📞 Phone Support:</strong> Available for urgent order issues</p>
            <p><strong>📍 Office Address:</strong> (Add when registered)</p>
            <p>Our team responds within 12–24 hours.</p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>🧭 3. Tailor Guidelines</h3>
          <div className={styles.guidelinesContainer}>
            <ul>
              <li>Maintain quality stitching and timely delivery.</li>
              <li>Keep communication clear via the in-app messaging.</li>
              <li>Update order status regularly to avoid delays.</li>
              <li>Upload clear photos of completed work for customer assurance.</li>
            </ul>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>🛠️ 4. Troubleshooting</h3>
          <div className={styles.troubleshootingContainer}>
            <p><strong>App not loading?</strong> Clear cache or reinstall the latest version.</p>
            <p><strong>Cannot accept order?</strong> Ensure profile verification is complete.</p>
            <p><strong>Payment failed?</strong> Try another method or contact support.</p>
            <p><strong>Notification issues?</strong> Enable notifications in phone settings.</p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>📄 5. Policies & Terms</h3>
          <div className={styles.policiesContainer}>
            <p>For detailed legal information, please review:</p>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Cancellation & Refund Policy</li>
              <li>Tailor Partnership Agreement</li>
            </ul>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h3 className={styles.sectionTitle}>🤝 6. Community Commitment</h3>
          <div className={styles.commitmentContainer}>
            <p>At Threadify, we are dedicated to empowering local tailors and offering customers high-quality, professional tailoring services.
            Your feedback helps us improve — feel free to share suggestions anytime.</p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>⭐ Need Help Right Now?</h3>
          <p className={styles.ctaText}>Tap "Contact Support" below and we'll be with you shortly.</p>
          <Link to="/contact" className={styles.contactButton} title="Contact our support team">Contact Support</Link>
        </div>
      </section>
    </div>
  );
};

export default TailorSupport;
