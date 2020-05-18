import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../reducers/authActions';
import { Link, Redirect } from 'react-router-dom';

const Login = ({ login, auth: { isAuthenticated, isLoading } }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = data;
  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  if (isAuthenticated && !isLoading) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <>
      {' '}
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into Your Account
      </p>
      <form className='form' action='dashboard.html' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            name='email'
            placeholder='email'
            autoComplete='current-email'
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password'
            placeholder='password'
            autoComplete='current-password'
            value={password}
            onChange={onChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { login })(Login);
