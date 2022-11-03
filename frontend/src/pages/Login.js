import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setACookie } from '../utils/auth.utils';
import { authActions } from '../redux/auth/authSlice';
import authApiSlice from '../redux/auth/authApi';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userLogin] = authApiSlice.useUserLoginMutation();

  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;

  const submitEventHandler = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).every((x) => x === null || x === '');
    if (isEmpty) return alert('all fields are required');

    const { data, error } = await userLogin(formData);
    if (error?.data?.error) {
      alert(error?.data?.error);
    } else {
      dispatch(authActions.loginSuccess(data?.result?.user));
      setACookie('token', data?.result?.access?.token);
      setACookie('refreshToken', data?.result?.refresh?.token);
      navigate('/dash');
    }
    setFormData({
      email: '',
      password: ''
    });
  };
  return (
    <form>
      <div className="row mt-5 px-5">
        <div className="col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="col mt-4">
          <button type="submit" className="btn btn-primary" onClick={submitEventHandler}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
