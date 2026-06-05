import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import SplashScreen from '../SplashScreen';
import BlurText from '../../ui/BlurText';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import styles from '../Hero.module.css';
import CombinedAnimation from '../../ui/CombinedAnimation';
import useLenis from '../../hooks/useLenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HomePage = () => {
  const [containerRef, isVisible] = useAnimateOnScroll({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Initialize Lenis for smooth scrolling
  useLenis();

  const animationClass = isVisible ? styles.visible : '';

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Target all sections that should fade in on scroll
    const sectionsToAnimate = gsap.utils.toArray('.content-section');

    sectionsToAnimate.forEach(section => {
      const heading = section.querySelector('h2');
      const paragraph = section.querySelector('p');
      const cards = section.querySelectorAll('.info-card-item');

      // Animate the heading and paragraph first
      gsap.from([heading, paragraph], {
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Then animate the cards with a stagger
      gsap.from(cards, {
        y: 50,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.2, // This is the key! Animates each card 0.2s after the previous one.
        scrollTrigger: {
          trigger: section,
          start: 'top 70%', // Start this animation a bit later
          toggleActions: 'play none none none',
        },
      });
    });
  }, []);

  return (
    <>
      <SplashScreen />
      <CombinedAnimation />
      {/* All sections need a relative position to stack on top of the fixed background */}
      <section className="hero-section relative flex flex-col items-center justify-center text-center min-h-screen px-4 pt-16 z-10">
        <div id='hero' ref={containerRef} className="max-w-4xl relative z-10">
          <BlurText
            text="Perfect Fit, Delivered to Your Door."
            delay={150}
            className="heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4"
          />
          <p className={`description text-lg md:text-xl max-w-2xl mx-auto mb-8 ${animationClass}`}>
            Experience the magic of custom tailoring without leaving your home. We connect you with expert tailors for alterations, repairs, and bespoke creations.
          </p>
          <div className={`flex justify-center gap-4 description ${animationClass}`} style={{ animationDelay: '0.7s' }}>
            <Link to="/services" className="card-nav-cta-button">Explore Services</Link>
            <Link to="/login" className="card-nav-cta-button secondary">Book a Pickup</Link>
          </div>
        </div>
      </section>

      <section className="content-section relative py-20 px-4 text-center bg-transparent z-10 overflow-hidden">
        <CombinedAnimation fixed={false} />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-[#FF94B4]">How It Works</h2>
          <p className="text-lg text-white mb-12">A seamless process from start to finish.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-2xl font-semibold mb-2 text-white">1. Book a Pickup</h3>
              <p className="text-white">Schedule a convenient time for us to collect your garments right from your doorstep.</p>
            </div>
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-2xl font-semibold mb-2 text-white">2. Expert Tailoring</h3>
              <p className="text-white">Our skilled tailors work their magic, ensuring every stitch is perfect and fits you flawlessly.</p>
            </div>
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-2xl font-semibold mb-2 text-white">3. Delivered Back</h3>
              <p className="text-white">Receive your freshly tailored clothes back, ready to wear, without any hassle.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section relative py-20 px-4 text-center z-10 overflow-hidden">
        <CombinedAnimation fixed={false} />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-[#d4af37]">Why Choose Threadify?</h2>
          <p className="text-lg text-gray-300 mb-12">Quality, convenience, and craftsmanship you can trust.</p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-xl font-semibold mb-2 text-white">Unmatched Convenience</h3>
              <p className="text-gray-400">Skip the trips to the tailor. We handle the logistics so you can focus on what matters.</p>
            </div>
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-xl font-semibold mb-2 text-white">World-Class Artisans</h3>
              <p className="text-gray-400">We partner with a curated network of the most talented and experienced tailors.</p>
            </div>
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-xl font-semibold mb-2 text-white">Transparent Pricing</h3>
              <p className="text-gray-400">No hidden fees. Get clear, upfront pricing for all our services before you commit.</p>
            </div>
            <div className={`${styles.infoCard} info-card-item`}>
              <h3 className="text-xl font-semibold mb-2 text-white">Satisfaction Guaranteed</h3>
              <p className="text-gray-400">Your happiness is our priority. We're not satisfied until you're delighted with the fit.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
