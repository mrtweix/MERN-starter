import React from 'react';
import DashFooter from './DashFooter';
import { Outlet } from 'react-router-dom';

const DashLayout = () => {
  return (
    <div>
      <Outlet />
      <DashFooter />
    </div>
  );
};

export default DashLayout;
