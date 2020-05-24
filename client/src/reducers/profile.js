import {
  GET_PROFILE,
  PROFILE_ERROR,
  LOGOUT,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILES,
  GET_REPOS,
  CLEAR_PROFILE,
} from './types';

const initialState = {
  profile: JSON.parse(localStorage.getItem('profile')),
  profiles: [],
  repos: [],
  isLoading: true,
  error: {},
};
export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      localStorage.setItem('profile', JSON.stringify(payload));
      return { ...state, profile: payload, isLoading: false };
    case PROFILE_ERROR:
      return { ...state, error: payload, isLoading: false, profile: null };
    case LOGOUT:
    case DELETE_ACCOUNT:
    case CLEAR_PROFILE:
      localStorage.removeItem('profile');
      return { ...state, profile: null };
    case GET_PROFILES:
      return { ...state, profiles: payload, isLoading: false };
    case GET_REPOS:
      return { ...state, repos: payload, isLoading: false };

    default:
      return state;
  }
};
