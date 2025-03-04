import axios from 'axios';

//axios config
const axiosConfig = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials for CORS
  withCredentials: false,
  // Ensure cookies are not sent with requests
  xsrfCookieName: undefined,
  xsrfHeaderName: undefined,
});

//axios interceptors
axiosConfig.interceptors.request.use(
  config => {
    // Add debug logging
    console.log(`Making API request to: ${config.baseURL}${config.url}`);

    // Add CORS headers explicitly
    config.headers['Access-Control-Allow-Origin'] = '*';

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
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

//axios response interceptors
axiosConfig.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle network errors more gracefully
    if (!error.response) {
      console.error('Network error or CORS issue:', error.message);
      // Create a mock response for development/fallback
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_FALLBACK === 'true') {
        console.warn('Using fallback data due to API connection issue');
        return Promise.resolve({
          data: { status: true, data: [] },
        });
      }
    }

    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosConfig;
