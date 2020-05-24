import axios from 'axios';
import { setAlert } from './alertActions';
import setAuthToken from '../utils/setAuthToken';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS,
} from './types';

const url = 'http://localhost:5000';
export const getCurrentProfile = (id) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.get(url + '/api/profile/me', { body: { id } });

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

//get all profiles
export const getProfiles = () => async (dispatch) => {
  setAuthToken();
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get(url + '/api/profile');

    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};
export const getProfileById = (userId) => async (dispatch) => {
  setAuthToken();
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get(url + `/api/profile/${userId}`);

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

// get github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.post(
      url + '/api/profile/github',
      { username },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    dispatch({ type: GET_REPOS, payload: res.data });
  } catch (error) {
    console.log(error.response);
  }
};
export const createProfile = (formData, history, edit = false) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const res = await axios.post(url + '/api/profile', formData, config);

    dispatch({ type: GET_PROFILE, payload: res.data });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};
//Add experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const res = await axios.put(url + '/api/profile/experience', formData, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert('Experience Added', 'success'));

    history.push('/dashboard');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

//Delete experience

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(url + '/api/profile/experience', {
      headers: { 'Content-type': 'application/json' },
      data: { id },
    });
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
  } catch (error) {}
};

//Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const res = await axios.post(url + '/api/profile/education', formData, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert('Education Added', 'success'));

    history.push('/dashboard');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(url + '/api/profile/education', {
      headers: { 'Content-type': 'application/json' },
      data: { id },
    });
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert('Education Deleted', 'success'));
  } catch (error) {}
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!!!')) {
    const res = await axios.delete(url + '/api/profile');
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: DELETE_ACCOUNT });
    dispatch(setAlert(res.data.msg, 'success'));
  }
};
