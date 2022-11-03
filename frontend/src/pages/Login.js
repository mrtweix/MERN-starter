import React from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../redux/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;

  const submitEventHandler = e => {
    e.preventDefault();
    console.log(formData);
    dispatch(authActions.login(formData));
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
