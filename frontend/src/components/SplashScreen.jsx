import React, { useState, useEffect } from 'react';
import BlurText from '../ui/BlurText';
import WavingMeshAnimation from '../ui/WavingMeshAnimation';
import styles from './SplashScreen.module.css';



const SplashScreen = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled more than a few pixels
      if (window.scrollY > 10) {
        setIsScrolled(true);
        // Clean up the event listener once it's fired
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Add the event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the listener if the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className={`${styles.splashScreen} ${isScrolled ? styles.hidden : ''}`}>
      <WavingMeshAnimation />
      <BlurText
        text="Welcome to Threadify"
        delay={150}
        className={styles.welcomeText}
      />
    </div>
  );
};

export default SplashScreen;