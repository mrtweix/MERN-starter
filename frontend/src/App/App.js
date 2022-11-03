import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashLayout from '../components/DashLayout';
import Layout from '../components/Layout';
import Homepage from '../pages/Homepage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainDash from '../pages/MainDash';
import NotFoundPage from '../components/NotFoundPage';
import { withCookies } from 'react-cookie';
import useAuth from '../hooks/useAuth';

const App = () => {
  useAuth();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<MainDash />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default withCookies(App);
