import axios from 'axios';

//axios config
const axiosConfig = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

//axios interceptors
axiosConfig.interceptors.request.use(
  config => {
    //TODO: add the auth token to the headers
    //get the token from the local storage
    //  const token = localStorage.getItem('token');
    //if the token is present, add it to the headers
    //  if (token) {
    //    config.headers.Authorization = `Bearer ${token}`;
    //  }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//axios response interceptors
axiosConfig.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosConfig;
