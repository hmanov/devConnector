import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Login = (props) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = data;
  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {};
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
            placeholder='Email Address'
            name='email'
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
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

Login.propTypes = {};

export default Login;
