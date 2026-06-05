import React from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import styles from './ServicesPage.module.css';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import { AlignCenter } from 'lucide-react';

const ServiceCard = ({ icon, title, description, listTitle, items, quote, index }) => {
  const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.1, triggerOnce: true });
  const animationClass = isVisible ? styles.cardVisible : styles.cardHidden;

  return (
    <div ref={ref} className={`${styles.serviceCard} ${styles.cardAnimate} ${animationClass}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <h3 className={styles.serviceTitle}>
        <span className={styles.serviceIcon}>{icon}</span> {title}
      </h3>
      <p className={styles.serviceTagline}>{description}</p>
      {listTitle && <h4 className={styles.listTitle}>{listTitle}</h4>}
      <ul className={styles.serviceList}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p className={styles.serviceQuote}>“{quote}”</p>
    </div>
  );
};

const ServicesPage = () => {
  return (
    <div className={`${styles.servicesPage} content-wrapper`}>
      <header className={styles.hero}>
        <BlurText text="✂️ Crafted to Fit You — Perfectly" delay={150} className="heading" />
        <p className={`${styles.heroDescription} description`}>
          At Threadify, we believe that great style starts with the perfect fit. Our services are designed to bring professional tailoring right to your fingertips — simple, personalized, and stress-free.
          <br /><br />
          Whether you need a quick fix, a complete makeover, or something designed just for you, we’re here to make every outfit feel like it was made for you.
        </p>
      </header>

      <main className={styles.servicesGrid}>
        <ServiceCard
          icon="🧵"
          title="1. Custom Tailoring"
          description="Your imagination, our craftsmanship."
          listTitle="Perfect for:"
          items={[
            '👔 Suits & Blazers',
            '👗 Dresses & Gowns',
            '🥻 Ethnic Wear & Traditional Outfits',
            '👖 Custom Pants, Shirts & Jackets',
          ]}
          index={0}
          quote="You dream it, we stitch it — just your way."
        />

        <ServiceCard
          icon="🪡"
          title="2. Alteration & Repair Services"
          description="Don’t let your favorite outfit go unworn because of a poor fit or small tear. Our alteration experts handle everything from resizing to zip repairs, ensuring your clothes look and feel brand new."
          listTitle="We fix:"
          items={[
            'Size adjustments',
            'Hemming & shortening',
            'Zip and button replacements',
            'Patchwork and minor repairs',
          ]}
          index={1}
          quote="Because perfect clothes deserve a second chance."
        />

        <ServiceCard
          icon="👚"
          title="3. Doorstep Pick-Up & Delivery"
          description="Skip the travel and waiting time. Threadify brings the tailor to your doorstep. Simply book a service, schedule a pick-up, and we’ll handle the rest — from measurements to delivery — with love and care."
          listTitle="Convenience Includes:"
          items={[
            '🚪 Free home pick-up & drop',
            '🕓 Flexible scheduling',
            '💬 Live order tracking',
            '✅ On-time delivery guaranteed',
          ]}
          index={2}
          quote="Tailoring made effortless — right from your home."
        />

        <ServiceCard
          icon="👗"
          title="4. Express Tailoring"
          description="Need it fast? We’ve got you covered! Our express tailoring service ensures your garments are stitched or altered within a shorter timeline — without compromising quality."
          listTitle="Available For:"
          items={[
            'Last-minute events',
            'Urgent alterations',
            'Same-week deliveries',
          ]}
          index={3}
          quote="When time is short, our needles move faster."
        />

        <ServiceCard
          icon="🧶"
          title="5. Tailor Partner Services (For Tailors)"
          description="Threadify isn’t just for customers — it’s a community that supports local artisans. If you’re a tailor, we help you grow your business online, connect with new clients, and manage orders easily through our app."
          listTitle="We offer tailors:"
          items={[
            '📱 A digital workspace to accept orders',
            '📊 Tools to manage customers & payments',
            '🌍 Visibility to a growing user base',
          ]}
          index={4}
          quote="Empowering tailors, one stitch at a time."
        />
      </main>

      <section className={styles.whyChooseSection}>
        <h2 className={styles.subHeading}>🌟 Why Choose Threadify?</h2>
        <ul className={styles.featuresList}>
          <li>✔️ Experienced and verified tailors</li>
          <li>✔️ Transparent pricing</li>
          <li>✔️ Fast, reliable, and convenient</li>
          <li>✔️ Quality guaranteed — every time</li>
        </ul>
      </section>

      <footer className={styles.ctaSection}>
        <h2 className={styles.subHeading}>💬 Ready to Get Started?</h2>
        <center>
          <p className="description">Whether you need a custom design or just a quick alteration, Threadify is here to make tailoring simple, smart, and satisfying. Book your first service today — and experience the difference of tailoring made with heart. 💛</p>
        </center>
        <div className={styles.ctaButtons}>
          <Link to="/login" className="card-nav-cta-button">Book a Service</Link>
          <Link to="/contact" className="card-nav-cta-button secondary">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;