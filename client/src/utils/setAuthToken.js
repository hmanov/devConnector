import axios from 'axios';

const setAuthToken = (token = localStorage.getItem('token')) => {
  axios.defaults.headers.common['x-auth-token'] = token;
};

export default setAuthToken;
