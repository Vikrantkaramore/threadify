import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#FF94B4', textDecoration: 'underline' }}>Go to Homepage</Link>
    </div>
  );
};

export default NotFoundPage;