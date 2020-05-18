import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: '',
};

const CreateProfile = (props) => {
  const [data, setData] = useState(initialState);
  return <div></div>;
};

CreateProfile.propTypes = {};

export default connect()(CreateProfile);
