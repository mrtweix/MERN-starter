import React from 'react';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';
import { Outlet } from 'react-router-dom';

const DashLayout = () => {
  return (
    <div>
      <DashHeader />
      <Outlet />
      <DashFooter />
    </div>
  );
};

export default DashLayout;
