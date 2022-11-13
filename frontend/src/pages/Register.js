import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApiSlice from '../redux/auth/authApi';

const Register = () => {
  const navigate = useNavigate();

  const [userRegistration] = authApiSlice.useUserRegistrationMutation();

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const { firstName, lastName, email, password } = formData;

  const submitEventHandler = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).every((x) => x === null || x === '');
    if (isEmpty) return alert('all fields are required');

    const { data, error } = await userRegistration(formData);
    console.log(data, error);
    // if (error?.data?.error) {
    //   alert(error?.data?.error);
    // } else {
    //   alert(data?.result);
    //   navigate('/');
    // }
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  };
  return (
    <form>
      <div className="row mt-4 px-5">
        <div className="col-md-6 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter firstname"
            name="firstName"
            value={firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter lastname"
            name="lastName"
            value={lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mt-4">
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="col-md-6 mt-4">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="col-md-6 mt-4">
          <button type="submit" className="btn btn-primary" onClick={submitEventHandler}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Register;
