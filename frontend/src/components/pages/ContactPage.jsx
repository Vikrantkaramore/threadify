import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiMessageSquare } from 'react-icons/fi';
import BlurText from '../../ui/BlurText';
import AnimatedSection from './AnimatedSection';
import useForm from '../../hooks/useForm';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const initialState = {
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  };

  const validate = (values) => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = 'Name is required.';
    if (!values.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (values.phone && !/^\+?\d{10,14}$/.test(values.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!values.serviceType) newErrors.serviceType = 'Please select a service type.';
    if (!values.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const submitForm = async (formData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for your message! We will get back to you shortly.');
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to send message: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
    initialState, validate, submitForm
  );

  return (
    <div className={`${styles.contactPage} content-wrapper`}>
      <header className={styles.hero}>
        <BlurText text="Let’s Stitch Something Beautiful Together." delay={150} className={`${styles.heroHeading} heading`} />
        <p className={`${styles.heroSubtext} description`}>
          We’d love to hear from you — whether it’s a question, a collaboration, or just to say hi.
        </p>
      </header>

      <main className={styles.mainContent}>
        <AnimatedSection as="div" className={`${styles.section} ${styles.formSection}`}>
          <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles.inputField} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
              </div>
              <div className={styles.formGroup}>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className={`${styles.selectField} ${errors.serviceType ? styles.inputError : ''}`}
                >
                  <option value="">Select Service Type</option>
                  <option value="custom-tailoring">Custom Tailoring</option>
                  <option value="alteration">Alteration</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
                {errors.serviceType && <span className={styles.errorMessage}>{errors.serviceType}</span>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className={`${styles.textareaField} ${errors.message ? styles.inputError : ''}`}
              ></textarea>
              {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
            </div>
            <button type="submit" className={`${styles.submitButton} card-nav-cta-button`} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </AnimatedSection>

        <AnimatedSection as="div" className={`${styles.section} ${styles.alternativeContact}`}>
          <h3 className={styles.subHeading}>Other Ways to Reach Us</h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <FiMapPin className={styles.contactIcon} />
              <h4>Address</h4>
              <p>IT Park Street, Nagpur, India</p>
            </div>
            <div className={styles.contactItem}>
              <FiPhone className={styles.contactIcon} />
              <h4>Phone</h4>
              <p>+91 7391907186</p>
            </div>
            <div className={styles.contactItem}>
              <FiMail className={styles.contactIcon} />
              <h4>Email</h4>
              <p>support@threadify.in</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection as="div" className={`${styles.section} ${styles.socialSection}`}>
          <h3 className={styles.subHeading}>Prefer chatting?</h3>
          <div className={styles.socialIcons}>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FiMessageSquare />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
          </div>
        </AnimatedSection>
      </main>

      <footer className={styles.footer}>
        <p className={styles.finalTagline}>
          “Every great outfit begins with a conversation — let’s start one.”
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;