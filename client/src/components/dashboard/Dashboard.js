import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile } from '../../reducers/profileActions';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, isLoading } }) => {
  useEffect(() => {
    if (user) {
      getCurrentProfile(user._id);
    }
  }, [getCurrentProfile, user]);
  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'>Welcome {user && user.name}</i>
      </p>
      {profile !== null ? (
        <></>
      ) : (
        <>
          <p>You have not set up a profile, please add some info</p>{' '}
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object,
  auth: PropTypes.object,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);