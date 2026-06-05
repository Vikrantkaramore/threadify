import React from 'react';
import Aurora from '../ui/Aurora';

const Background = () => {
  return (
    <Aurora
      className="fixed top-0 left-0 w-full h-full -z-10 scale-150"
      colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
      blend={0.5}
      amplitude={0.8}
      speed={0.5}
    />
  );
};

export default Background;