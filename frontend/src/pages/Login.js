import React from 'react';
import { useDispatch } from 'react-redux';
import authApiSlice from '../redux/auth/authApi';
import { authActions } from '../redux/auth/authSlice';
import { setACookie } from '../utils/auth.utils';

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = authApiSlice.useLoginMutation();

  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;

  const submitEventHandler = async e => {
    e.preventDefault();
    const result = await login(formData);
    console.log(result);
    // setACookie('token', result?.access?.token, result?.access?.expires);
    // dispatch(authActions.loginRequest(formData));
  };
  return (
    <form>
      <div className="row mt-5 px-5">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-primary" onClick={submitEventHandler}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
