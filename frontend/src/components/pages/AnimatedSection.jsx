import React, { useEffect, useState } from 'react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import styles from './AnimatedSection.module.css';

const AnimatedSection = ({ children, className, as = 'section', threshold = 0.1, triggerOnce = true }) => {
  const Tag = as;
  const [isVisible, setIsVisible] = useState(false);
  const [ref, inView] = useAnimateOnScroll({ threshold, triggerOnce });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [inView, triggerOnce]);

  const animationClass = isVisible ? styles.visible : styles.hidden;

  return <Tag ref={ref} className={`${className || ''} ${styles.animate} ${animationClass}`}>{children}</Tag>;
};

export default AnimatedSection;