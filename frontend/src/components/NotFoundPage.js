import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <article>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Link to="/">Go Back</Link>
      </article>
    </div>
  );
};

export default NotFoundPage;
