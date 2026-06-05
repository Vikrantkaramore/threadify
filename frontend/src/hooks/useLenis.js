import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * A custom hook to manage a Lenis smooth scrolling instance.
 * This should ideally be used in a top-level layout component.
 */
const useLenis = () => {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    });

    // Sync ScrollTrigger with Lenis's scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker to run Lenis's RAF (requestAnimationFrame) loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Lenis expects time in milliseconds
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      // It's good practice to kill ScrollTriggers and tickers on cleanup
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // You might not need to kill the ticker if it's used elsewhere, but for safety:
      // gsap.ticker.remove(lenis.raf); 
    };
  }, []);
};

export default useLenis;