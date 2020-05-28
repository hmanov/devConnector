import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_USER,
  AUTH_ERROR,
  LOGOUT,
  DELETE_ACCOUNT,
  SET_LOADING,
} from './types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  isLoading: true,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return { ...state, isLoading: true };
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, isLoading: false };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, isLoading: false };
    case SET_USER:
      localStorage.setItem('user', JSON.stringify(payload));
      return { ...state, user: payload, isLoading: false };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case DELETE_ACCOUNT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      return { ...state, token: false, isAuthenticated: false, isLoading: false, user: null };
    default:
      return state;
  }
};
