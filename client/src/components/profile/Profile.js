import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../reducers/profileActions';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({ match, getProfileById, profile: { isloading, profile }, auth }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <>
      {!profile || isloading ? (
        <Spinner />
      ) : (
        <>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated && !auth.isloading && auth.user._id === profile.user._id && (
            <Link to='edit-profile' className='btn btn-dark'>
              Edit Profile{' '}
            </Link>
          )}
          <div className='profile-grid my-1'>
            {profile && (
              <>
                <ProfileTop profile={profile} />
                <ProfileAbout profile={profile} />
                <div className='profile-edu bg-white p-2'>
                  <h2 className='text-primary'>Experience</h2>
                  {profile.experience.length ? (
                    <>
                      {profile.experience.map((experience) => (
                        <ProfileExperience experience={experience} key={experience._id} />
                      ))}
                    </>
                  ) : (
                    <h4>No experience credentials</h4>
                  )}
                </div>
                <div className='profile-exp bg-white p-2'>
                  <h2 className='text-primary'>Experience</h2>
                  {profile.education.length ? (
                    <>
                      {profile.education.map((education) => (
                        <ProfileEducation education={education} key={education._id} />
                      ))}
                    </>
                  ) : (
                    <h4>No Education credentials</h4>
                  )}
                </div>
                {profile.githubusername && <ProfileGithub username={profile.githubusername} />}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
