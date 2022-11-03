import React from 'react';

const DashFooter = () => {
  return (
    <footer className="bg-light footer fixed-bottom">
      <p className="pt-3 text-center">This is footer section @{new Date().getFullYear()}</p>
    </footer>
  );
};

export default DashFooter;
