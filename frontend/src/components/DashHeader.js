import React from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeACookie } from '../utils/auth.utils';
import { authActions } from '../redux/auth/authSlice';
import authApiSlice from '../redux/auth/authApi';

const DashHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authenticated, cookies] = useAuth();
  const [userLogout] = authApiSlice.useUserLogoutMutation();

  const handleLogout = async (e) => {
    e.preventDefault();
    const { error } = await userLogout({ refreshToken: cookies.refreshToken });
    if (error?.data?.error) {
      alert(error?.data?.error);
    } else {
      removeACookie('token');
      removeACookie('refreshToken');
      dispatch(authActions.logout());
      navigate('/');
    }
  };
  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to={authenticated ? '/dash' : '/'} className="nav-link">
              Home
            </Link>
          </li>
          {authenticated ? (
            <li className="nav-item">
              <button type="button" className="border-0 nav-link bg-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default DashHeader;
