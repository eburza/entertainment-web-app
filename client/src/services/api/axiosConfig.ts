import axios from 'axios';

//axios config
const axiosConfig = axios.create({
  // Use the correct API URL - now with the Netlify Function path
  baseURL:
    process.env.REACT_APP_API_URL ||
    'https://emilia-burza-entertainment-app-server.netlify.app/.netlify/functions/api',
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

    // Add the auth token to the headers
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
  async error => {
    // Check if we should use fallback data (either in development or if REACT_APP_USE_FALLBACK is true)
    const shouldUseFallback =
      process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_FALLBACK === 'true';

    // Handle both network errors AND 404 responses
    if (!error.response || (error.response && error.response.status === 404)) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('API error or 404:', error.message || 'Not Found');
      }

      // Create a mock response if fallback is enabled
      if (shouldUseFallback) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('Using fallback data for:', error.config.url);
        }

        const url = error.config.url || '';
        let mockResponse;

        // Enhanced mock data that matches the API response format
        if (url.includes('movies')) {
          mockResponse = {
            status: true,
            data: {
              shows: [
                {
                  id: 'm1',
                  title: 'Mock Movie 1',
                  category: 'Movie',
                  isTrending: false,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                },
                {
                  id: 'm2',
                  title: 'Mock Movie 2',
                  category: 'Movie',
                  isTrending: true,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                },
              ],
            },
          };
        } else if (url.includes('tv')) {
          mockResponse = {
            status: true,
            data: {
              shows: [
                {
                  id: 't1',
                  title: 'Mock TV Show 1',
                  category: 'TV Series',
                  isTrending: false,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                },
                {
                  id: 't2',
                  title: 'Mock TV Show 2',
                  category: 'TV Series',
                  isTrending: true,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                },
              ],
            },
          };
        } else if (url.includes('trending') || url.includes('?trending=true')) {
          mockResponse = {
            status: true,
            data: {
              trending: [
                {
                  id: 'tr1',
                  title: 'Trending Show 1',
                  category: 'Movie',
                  isTrending: true,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                },
                {
                  id: 'tr2',
                  title: 'Trending Show 2',
                  category: 'TV Series',
                  isTrending: true,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                },
              ],
            },
          };
        } else if (url.includes('bookmarked')) {
          mockResponse = {
            status: true,
            data: {
              shows: [
                {
                  id: 'b1',
                  title: 'Bookmarked Show 1',
                  category: 'Movie',
                  isTrending: false,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                  isBookmarked: true,
                },
                {
                  id: 'b2',
                  title: 'Bookmarked Show 2',
                  category: 'TV Series',
                  isTrending: false,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                  isBookmarked: true,
                },
              ],
            },
          };
        } else if (url.includes('search')) {
          mockResponse = {
            status: true,
            data: {
              shows: [
                {
                  id: 's1',
                  title: 'Search Result 1',
                  category: 'Movie',
                  isTrending: false,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                },
                {
                  id: 's2',
                  title: 'Search Result 2',
                  category: 'TV Series',
                  isTrending: false,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                },
              ],
            },
          };
        } else {
          // Default shows for root endpoint
          mockResponse = {
            status: true,
            data: {
              shows: [
                {
                  id: '1',
                  title: 'Default Show 1',
                  category: 'Movie',
                  isTrending: false,
                  rating: 'PG',
                  year: 2023,
                  thumbnail: '/placeholder.jpg',
                },
                {
                  id: '2',
                  title: 'Default Show 2',
                  category: 'TV Series',
                  isTrending: true,
                  rating: 'PG-13',
                  year: 2024,
                  thumbnail: '/placeholder.jpg',
                },
              ],
            },
          };
        }

        return Promise.resolve({ data: mockResponse });
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('API Error:', error);
    }

    // Check if the error is a CORS error (will not have status code)
    if (!error.response && error.message.includes('Network Error')) {
      const originalRequest = error.config;

      // Only retry once to avoid infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Extract the original URL
        const originalUrl = originalRequest.url;

        // Use the CORS proxy function
        const proxyUrl = `https://emilia-burza-entertainment-app-server.netlify.app/.netlify/functions/cors-proxy?url=${encodeURIComponent(
          `https://api.themoviedb.org/3${originalUrl}`
        )}`;

        try {
          // Make the request through the proxy
          const proxyResponse = await axios.get(proxyUrl);
          return proxyResponse;
        } catch (proxyError) {
          return Promise.reject(proxyError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
