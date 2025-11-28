import React from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import styles from './PricingPage.module.css';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const PricingTable = ({ headers, rows }) => (
  <div className={styles.tableContainer}>
    <table className={styles.pricingTable}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} data-label={headers[cellIndex]}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PricingSection = ({ icon, title, description, tableData, quote, index }) => {
  const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.1, triggerOnce: true });
  const animationClass = isVisible ? styles.sectionVisible : styles.sectionHidden;

  return (
    <section ref={ref} className={`${styles.pricingSection} ${styles.sectionAnimate} ${animationClass}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>{icon}</span> {title}
      </h3>
      <p className={styles.sectionDescription}>{description}</p>
      <PricingTable headers={tableData.headers} rows={tableData.rows} />
      <p className={styles.sectionQuote}>“{quote}”</p>
    </section>
  );
};

const PricingPage = () => {
  const customTailoringData = {
    headers: ['Garment Type', 'Starting Price*', 'Description'],
    rows: [
      ['Men’s Shirt', '₹499', 'Designed and stitched for your perfect fit'],
      ['Men’s Suit / Blazer', '₹2499', 'Crafted with precision and expert finishing'],
      ['Women’s Dress', '₹799', 'Elegant and comfortable custom design'],
      ['Saree Blouse', '₹599', 'Tailored to match your saree perfectly'],
      ['Traditional / Ethnic Wear', '₹999', 'Custom stitching for special occasions'],
    ],
  };

  const alterationsData = {
    headers: ['Service', 'Starting Price*', 'Description'],
    rows: [
      ['Pant or Jeans Alteration', '₹199', 'Waist, length, or taper adjustments'],
      ['Shirt / Top Alteration', '₹149', 'Perfect fitting for daily wear'],
      ['Zip Replacement', '₹99', 'Smooth, durable, and quick fix'],
      ['Minor Repairs', '₹99', 'Buttons, patches, or small tears'],
    ],
  };

  const doorstepData = {
    headers: ['Service', 'Price', 'Details'],
    rows: [
      ['Pick-up & Delivery', '₹0', 'Free for all tailoring & alteration services'],
      ['Express Delivery', '₹149', 'Get it delivered faster (24–48 hrs)*'],
    ],
  };

  const expressData = {
    headers: ['Type', 'Price Add-On', 'Delivery Time'],
    rows: [
      ['Same Week Delivery', '+₹199', 'Delivered within 3–5 days'],
      ['48-Hour Delivery', '+₹299', 'For last-minute stitching needs'],
    ],
  };

  const tailorData = {
    headers: ['Plan', 'Monthly Fee', 'Benefits'],
    rows: [
      ['Basic', '₹0', 'Get listed & receive limited orders'],
      ['Premium', '₹499', 'Unlimited orders, customer chat, and analytics'],
      ['Pro', '₹999', 'Full access + promotional visibility on the app'],
    ],
  };

  return (
    <div className={`${styles.pricingPage} content-wrapper`}>
      <header className={styles.hero}>
        <BlurText text="💰 Our Pricing" delay={150} className="heading" />
        <p className={`${styles.heroSubtitle} description`}>
          🧵 Transparent. Fair. Tailored for You.
        </p>
        <p className={`${styles.heroDescription} description`}>
          At Threadify, we believe quality tailoring shouldn’t come with hidden costs or surprises. That’s why our pricing is simple, transparent, and flexible — designed to fit your budget as perfectly as your clothes.
          <br /><br />
          Whether it’s a small fix or a full outfit design, you’ll always know exactly what you’re paying for.
        </p>
      </header>

      <main className={styles.pricingGrid}>
        <PricingSection icon="👗" title="1. Custom Tailoring" description="Get your dream outfit stitched from scratch — personalized to your size, style, and occasion." tableData={customTailoringData} quote="Your outfit, your way — made to perfection." index={0} />
        <PricingSection icon="🪡" title="2. Alterations & Repairs" description="Small changes make a big difference! Perfect for refitting, resizing, or refreshing your favorite clothes." tableData={alterationsData} quote="Give your clothes a second life — beautifully fitted again." index={1} />
        <PricingSection icon="🚪" title="3. Doorstep Services" description="Experience the comfort of home pick-up & delivery with every order." tableData={doorstepData} quote="Tailoring made effortless — right at your doorstep." index={2} />
        <PricingSection icon="⚡" title="4. Express Tailoring" description="Need it urgently? Choose Threadify Express to get your outfit done on priority." tableData={expressData} quote="When time runs short, our needles don’t stop." index={3} />
        <PricingSection icon="🧶" title="5. For Tailors — Partner Pricing" description="Are you a tailor looking to grow your business? Join the Threadify Partner Program and get access to our digital tools, customer base, and online payments — all in one app." tableData={tailorData} quote="Grow your business, reach more clients, and let your craft shine." index={4} />
      </main>

      <section className={styles.whyChooseSection}>
        <h2 className={styles.subHeading}>🌟 Why Our Customers Love Threadify</h2>
        <ul className={styles.featuresList}>
          <li>✅ Upfront pricing — no hidden costs</li>
          <li>✅ Pay only for what you need</li>
          <li>✅ Easy online payment & receipts</li>
          <li>✅ Affordable yet premium-quality service</li>
        </ul>
      </section>

      <footer className={styles.ctaSection}>
        <h2 className={styles.subHeading}>💛 A Fit for Every Budget</h2>
        <center><p className="description">
          From quick fixes to full wardrobe makeovers, Threadify offers tailoring that fits your style — and your wallet. Choose your service, see your price, and let our experts handle the rest.
        </p></center>
        <p className={styles.finalQuote}>“Because every outfit deserves a perfect fit — without breaking the bank.”</p>
        <div className={styles.ctaButtons}>
          <Link to="/login" className="card-nav-cta-button">Book a Service Now</Link>
          <Link to="/services" className="card-nav-cta-button secondary">View All Packages</Link>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;