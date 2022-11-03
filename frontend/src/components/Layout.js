import { Outlet } from 'react-router-dom';
import React from 'react';
import DashHeader from './DashHeader';

const Layout = () => {
  return (
    <>
      <DashHeader />
      <Outlet />
    </>
  );
};

export default Layout;
