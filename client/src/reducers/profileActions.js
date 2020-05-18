import axios from 'axios';
import { setAlert } from './alertActions';
import setAuthToken from '../utils/setAuthToken';
import { GET_PROFILE, PROFILE_ERROR } from './types';

const url = 'http://localhost:5000';
export const getCurrentProfile = (id) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.get(url + '/api/profile/me', { body: { id } });

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};
