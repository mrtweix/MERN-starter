import React from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import authApiSlice from '../redux/auth/authApi';
import { authSelector } from '../redux/auth/authSlice';

const useAuth = () => {
  const [authenticated, setAutenticated] = React.useState(false);
  const authVals = useSelector(authSelector);
  const [cookies] = useCookies();
  const [userDetails] = authApiSlice.useUserDetailsMutation();

  React.useEffect(() => {
    if (cookies?.token) {
      // getUserDetails();
    }
  }, []);

  return [authenticated, cookies];
};

export default useAuth;
