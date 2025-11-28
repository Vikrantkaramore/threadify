import React from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import AnimatedSection from './AnimatedSection';
import t1 from '../../assets/t1.jpg';
import t2 from '../../assets/t2.jpg';
import t3 from '../../assets/t3.jpg';
import t4 from '../../assets/t4.jpg';
import styles from './AboutPage.module.css';

// --- Reusable Animated Components ---

import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const ValueIcon = ({ icon, title, index }) => {
  const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
  };

  return (
    <div ref={ref} className={styles.valueIcon} style={animationStyle} role="img" aria-label={title}>
      <span aria-hidden="true" className={styles.valueIconEmoji}>{icon}</span>
      <p className={styles.valueIconTitle}>{title}</p>
    </div>
  );
};

// --- Page Section Components ---

const TwoColumnSection = ({ title, description, imageUrl, imageAlt, reverse = false }) => (
  <AnimatedSection className={`${styles.section} ${styles.twoColumnSection} ${reverse ? styles.twoColumnSectionReverse : ''}`}>
    <div className={styles.textColumn}>
      <h2 className={styles.subHeading}>{title}</h2>
      <p className="description">{description}</p>
    </div>
    <div className={styles.imageColumn}>
      <img src={imageUrl} alt={imageAlt} className={styles.sectionImage} />
    </div>
  </AnimatedSection>
);

const HeroSection = () => (
  <header className={styles.hero}>
    <div className={styles.heroContent}>
      <div className={styles.heroText}>
        <BlurText text="Every Stitch Has a Story." delay={150} className={`${styles.heroHeading} heading`} />
        <p className={`${styles.heroDescription} description`}>
          Threadify was born from a passion for style, precision, and the belief that everyone deserves a perfect fit.
          It all started with something simple — a love for clothes that fit perfectly and the people who make them.
          We noticed how hard it had become to find a tailor who truly understands your style, your body, and your time.
          Endless visits, missed fittings, and uncertainty made something once beautiful — feel like a chore.
          <br /><br />
          That’s when we asked ourselves a question:
          "What if getting your clothes tailored could be as easy as tapping a button?"
          <br /><br />
          And just like that, the first thread of Threadify was woven.
        </p>
      </div>
      <div className={styles.heroImageContainer}>
        <img src={t1} alt="Early sketches of Threadify" className={styles.heroImage} />
      </div>
    </div>
  </header>
);

// AboutPage Component
const AboutPage = () => {
  // Schema markup for SEO
  const schema = {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': 'Threadify',
        'url': 'https://www.threadify.com', // Use your actual domain
        'logo': 'https://www.threadify.com/logo.png', // Use your actual logo URL
        'description': 'Threadify connects people with skilled local tailors to make custom clothing accessible to everyone, combining tradition with technology.',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Customer Service',
          'email': 'service@threadify.com'  
        },
        'sameAs': [
          'https://www.linkedin.com/in/vikrant-karamore-4b8b78257/'
        ]
      },
      {
        '@type': 'AboutPage',
        'isPartOf': { '@id': 'https://www.threadify.com/#website' }, // Link to website
        'mainEntity': {
          '@type': 'Organization',
          '@id': 'https://www.threadify.com/#organization' // Link to organization
        },
        'url': 'https://www.threadify.com/about' // Use your actual domain
      }
    ]
  };

  const sectionsData = [
    {
      type: 'two-column',
      title: 'How It All Started',
      description: 'It all began with a simple realization — finding a reliable tailor shouldn’t be difficult. Between busy schedules, miscommunication, and endless visits, the joy of wearing custom clothes was fading. That’s when we decided to create Threadify, a platform that makes tailoring as effortless as shopping online.',
      imageUrl: t4,
      imageAlt: 'Tailoring process',
    },
    {
      type: 'mission',
      title: 'Our Mission',
      description: 'At Threadify, our mission is to connect people with skilled local tailors and make custom clothing accessible to everyone — combining tradition with technology.',
      values: [
        { icon: "🤝", title: "Connection" },
        { icon: "🧵", title: "Craftsmanship" },
        { icon: "⚙️", title: "Innovation" },
        { icon: "❤️", title: "Trust" },
        { icon: "📲", title: "Convenience" },
      ]
    },
    {
      type: 'two-column',
      title: 'Empowering Tailors',
      description: 'Threadify empowers local tailors by giving them digital visibility, more customers, and tools to grow their business. Every tailor’s skill tells a story, and we’re here to amplify it.',
      imageUrl: t2,
      imageAlt: 'Empowering local tailors',
    },
    {
      type: 'two-column',
      title: 'For Our Customers',
      description: 'We believe that confidence starts with the right fit. Threadify helps you express your style through clothes made just for you — tailored to your personality, comfort, and body.',
      imageUrl: t3,
      imageAlt: 'Customer satisfaction',
      reverse: true,
    },
    {
      type: 'promise',
      title: 'The Threadify Promise',
      description: 'We promise to keep redefining tailoring — making it smarter, faster, and more personal, while never losing the human touch that makes it special.',
      items: ['✅ 100% Transparency', '✅ Trusted Local Experts', '✅ Style that fits your life'],
    },
    {
      type: 'simple',
      title: 'Looking Ahead',
      description: 'We’re just getting started. Our vision is to make Threadify the go-to tailoring platform across cities, helping millions experience the joy of a perfect fit.',
    },
  ];

  return (
    <div className={`${styles.aboutPage} content-wrapper`}>
      {/* --- Primary Meta Tags --- */}
      <title>About Us - Threadify</title>
      <meta name="description" content="Learn about Threadify's story, mission, and the team dedicated to revolutionizing the tailoring industry." />
      <link rel="canonical" href="https://www.threadify.com/about" />

      {/* --- Open Graph / Facebook --- */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.threadify.com/about" />
      <meta property="og:title" content="About Us - Threadify" />
      <meta property="og:description" content="Learn about Threadify's story, mission, and the team dedicated to revolutionizing the tailoring industry." />
      <meta property="og:image" content="https://www.threadify.com/og-image-about.jpg" /> {/* Create a specific OG image */}

      {/* --- Twitter --- */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.threadify.com/about" />
      <meta property="twitter:title" content="About Us - Threadify" />
      <meta property="twitter:description" content="Learn about Threadify's story, mission, and the team dedicated to revolutionizing the tailoring industry." />
      <meta property="twitter:image" content="https://www.threadify.com/og-image-about.jpg" />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <HeroSection />

      <main className={styles.main}>
        {sectionsData.map((section, index) => {
          if (section.type === 'two-column') {
            return <TwoColumnSection key={index} {...section} />;
          }
          if (section.type === 'mission') {
            return (
              <AnimatedSection key={index} className={`${styles.section} ${styles.missionSection}`}>
                <div className={styles.missionLayout}>
                  <div className={styles.textColumn}>
                    <h2 className={styles.subHeading}>{section.title}</h2>
                    <p className="description">{section.description}</p>
                  </div>
                  <div className={styles.missionIcons}>
                    {section.values.map((value, i) => (
                      <ValueIcon key={i} {...value} index={i} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            );
          }
          if (section.type === 'promise') {
            return (
              <AnimatedSection key={index} className={`${styles.section} ${styles.promiseSection}`}>
                <h2 className={styles.subHeading}>{section.title}</h2>
                <p className="description">{section.description}</p>
                <ul className={styles.promiseList}>
                  {section.items.map((item, i) => <li key={i} className={i > 0 ? styles.promiseListItem : ''}>{item}</li>)}
                </ul>
              </AnimatedSection>
            );
          }
          if (section.type === 'simple') {
            return (
              <AnimatedSection key={index} className={styles.section}>
                <h2 className={styles.subHeading}>{section.title}</h2>
                <p className="description">{section.description}</p>
              </AnimatedSection>
            );
          }
          return null;
        })}
      </main>

      {/* 9. Call to Action */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h2 className={styles.subHeading}>Join our journey — let’s stitch something amazing together.</h2>
          <Link to="/contact" className={`${styles.ctaButton} card-nav-cta-button`}>Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
