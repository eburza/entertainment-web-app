import axios from 'axios';

//axios config
const axiosConfig = axios.create({
  // Use the correct API URL
  baseURL:
    process.env.REACT_APP_API_URL || 'https://emilia-burza-entertainment-app-server.netlify.app',
  headers: {
    'Content-Type': 'application/json',
  },
  // Disable withCredentials for standard CORS
  withCredentials: false,
  // Ensure cookies are not sent with requests
  xsrfCookieName: undefined,
  xsrfHeaderName: undefined,
});

//axios interceptors
axiosConfig.interceptors.request.use(
  config => {
    // Only log in development environment to avoid ESLint errors
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`Making API request to: ${config.baseURL}${config.url}`);
    }

    // Don't add CORS headers client-side - these are set by the server
    // Removing this line as browsers block these headers in requests
    // config.headers['Access-Control-Allow-Origin'] = '*';

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
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error in request interceptor:', error);
    }
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
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Network error or CORS issue:', error.message);
      }

      // Create a mock response for development/fallback
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_FALLBACK === 'true') {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('Using fallback data due to API connection issue');
        }

        const url = error.config.url;
        let mockData;

        // Return different mock data based on endpoint
        if (url?.includes('movies')) {
          mockData = { status: true, data: [{ title: 'Mock Movie', id: '1' }] };
        } else if (url?.includes('tv')) {
          mockData = { status: true, data: [{ title: 'Mock TV Show', id: '2' }] };
        } else {
          mockData = { status: true, data: [] };
        }

        return Promise.resolve({
          data: mockData,
        });
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
