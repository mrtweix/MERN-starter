import { Link } from 'react-router-dom';
import React from 'react';

const DashHeader = () => {
  return (
    <header>
      <div>
        <Link to="/dash">Dashboard</Link>
      </div>
    </header>
  );
};

export default DashHeader;
