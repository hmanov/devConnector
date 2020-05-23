import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../reducers/authActions';

const Navbar = ({ auth: { isLoading, isAuthenticated }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <a href='#!s' onClick={logout}>
          <i className='fas fa-sign-out-alt'></i> <span className='hide-sm'>Logout</span>
        </a>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i>
          Dashboard
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profile'>Developers</Link>
      </li>
      <li>
        <Link to='./register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(Navbar);
