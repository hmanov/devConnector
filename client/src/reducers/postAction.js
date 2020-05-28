import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

export const getPosts = () => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.get('/api/posts');
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

export const addLike = (postId) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.put(
      '/api/posts/like',
      { _id: postId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};
export const removeLike = (postId) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.put(
      '/api/posts/unlike',
      { _id: postId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};

//delete post
export const deletePost = (postId) => async (dispatch) => {
  setAuthToken();
  try {
    await axios.delete('/api/posts', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: postId,
    });
    dispatch({ type: DELETE_POST, payload: postId._id });
    dispatch(setAlert('Post removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};
//add post
export const addPost = (data) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.post('/api/posts', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert('Post created', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};

export const getPost = (id) => async (dispatch) => {
  setAuthToken();

  try {
    const res = await axios.post(
      '/api/posts/post',
      { _id: id },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    dispatch({ type: GET_POST, payload: res.data });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status },
    });
  }
};

//add Comment
export const addComment = (id, text) => async (dispatch) => {
  setAuthToken();
  try {
    const res = await axios.post(
      '/api/posts/comment',
      { _id: id, text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert('Comment added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};

//delete Comment
export const removeComment = (comment, postId) => async (dispatch) => {
  setAuthToken();
  try {
    await axios.delete(
      '/api/posts/comment',

      {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { comment, postId },
      }
    );

    dispatch({ type: REMOVE_COMMENT, payload: comment._id });
    dispatch(setAlert('Comment deleted', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.data, status: error.response.status },
    });
    dispatch(setAlert(error.response.data.msg, 'danger'));
  }
};
