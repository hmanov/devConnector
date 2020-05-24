import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../reducers/profileActions';
import { connect } from 'react-redux';
import ProfileItem from './ProfileItem';

const Profiles = ({ getProfiles, profile: { profiles, isLoading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and connect with developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((pf) => <ProfileItem key={pf._id} profile={pf} />)
            ) : (
              <h4>No profiles found</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
