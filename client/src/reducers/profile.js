import { GET_PROFILE, PROFILE_ERROR, LOGOUT } from './types';

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
      localStorage.setItem('profile', JSON.stringify(payload));
      return { ...state, profile: payload, isLoading: false };
    case PROFILE_ERROR:
      return { ...state, error: payload, isLoading: false };
    case LOGOUT:
      localStorage.removeItem('profile');
      return { ...initialState };
    default:
      return state;
  }
};
