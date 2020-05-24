import axios from 'axios';
import { setAlert } from './alertActions';
import { GET_POSTS, POST_ERROR } from './types';

const url = 'http://localhost:5000';
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(url + '/api/posts');
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (error) {}
};
