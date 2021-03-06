import axios from 'axios';
import { setAlert } from './alertActions';
import {
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  SET_USER,
  AUTH_ERROR,
  LOGOUT,
  SET_LOADING,
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Get user
export const getUser = (token) => async (dispatch) => {
  setAuthToken(token);
  dispatch({ type: SET_LOADING });
  try {
    const user = await axios.get('/api/auth');
    dispatch({ type: SET_USER, payload: user.data });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({ type: AUTH_ERROR });
    console.error(error.response.data);
  }
};

//Register User
const config = {
  headers: {
    'Content-type': 'application/json',
  },
};
export const register = ({ name, email, password }) => async (dispatch) => {
  const newUser = {
    name,
    email,
    password,
  };

  try {
    const res = await axios.post('/api/users', newUser, config);

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(getUser(res.data.token));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({ type: LOGIN_FAIL });
    console.error(error.response.data);
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const loginData = {
    email,
    password,
  };
  try {
    const res = await axios.post('/api/auth', loginData, config);

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(getUser(res.data.token));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({ type: LOGIN_FAIL });
    console.error(error.response.data);
  }
};
export const logout = (e, history) => (dispatch) => {
  e.preventDefault();
  history.push('/');
  dispatch({ type: LOGOUT });
};
