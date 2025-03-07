import React, { createContext, useState, useContext, useEffect } from 'react';
import { IAppContext, IBookmarkContext, IUser, IShow } from '../types/interface';
import api from '../services/api/api';
import { useParams } from 'react-router-dom';

const AppContext = createContext<IAppContext | undefined>(undefined);

// AppContext provider
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [shows, setShows] = useState<IShow[]>([]);
  const [movies, setMovies] = useState<IShow[]>([]);
  const [tvSeries, setTvSeries] = useState<IShow[]>([]);
  const [movieDetails, setMovieDetails] = useState<IShow | null>(null);
  const [tvSeriesDetails, setTvSeriesDetails] = useState<IShow | null>(null);
  const [bookmarks, setBookmarks] = useState<IBookmarkContext | null>(null);
  const [trending, setTrending] = useState<IShow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  // get params
  const params = useParams();

  // get shows
  useEffect(() => {
    async function getShows() {
      try {
        setIsLoading(true);
        const response = await api.getAllShows();
        setShows(response.data);
        setIsError(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Error in AppContext getShows:', error);
        setIsError(true);
        setErrorMessage('Error fetching shows');
        setShows([]);
      } finally {
        setIsLoading(false);
      }
    }

    getShows();
  }, []);

  // Authentication Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage('');

      const response = await api.login({ email, password });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.isAdmin || false);
        setIsGuest(response.data.user.isGuest || false);
        setIsUser(response.data.user.isUser || true);

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        setIsSuccess(true);
        setSuccessMessage('Login successful');
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Invalid email or password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage('');

      const response = await api.register({ name, email, password });

      if (response.data && response.data.success) {
        setIsSuccess(true);
        setSuccessMessage('Registration successful! Please login.');
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsGuest(false);
    setIsUser(false);

    // Remove token from localStorage
    localStorage.removeItem('token');

    setIsSuccess(true);
    setSuccessMessage('Logout successful');
  };

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await api.getCurrentUser();

          if (response.data && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            setIsAdmin(response.data.user.isAdmin || false);
            setIsGuest(response.data.user.isGuest || false);
            setIsUser(response.data.user.isUser || true);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuthStatus();
  }, []);

  // get trending
  useEffect(() => {
    async function getTrending() {
      try {
        setIsLoading(true);
        const response = await api.getTrending();
        setTrending(response.data);
        setIsError(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Error in AppContext getTrending:', error);
        setIsError(true);
        setErrorMessage('Error fetching trending');
        setTrending([]);
      } finally {
        setIsLoading(false);
      }
    }

    getTrending();
  }, []);

  // get movies
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        const response = await api.getMovies();
        setMovies(response.data);
      } catch (error) {
        console.error('Error in AppContext getMovies:', error);
        setIsError(true);
        setErrorMessage('Error fetching movies');
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // get tv series
  useEffect(() => {
    async function fetchTvSeries() {
      try {
        setIsLoading(true);
        const response = await api.getTvSeries();
        setTvSeries(response.data);
      } catch (error) {
        console.error('Error in AppContext getTvSeries:', error);
        setIsError(true);
        setErrorMessage('Error fetching tv series');
        setTvSeries([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTvSeries();
  }, []);

  // get movie details
  useEffect(() => {
    async function fetchMovieDetails(paramId: string | number): Promise<IShow | null> {
      if (!paramId) return null; // Skip if no ID is provided

      try {
        const data = await api.getMovieDetails(paramId as string);
        setMovieDetails(data as unknown as IShow);
        return data as unknown as IShow;
      } catch (error) {
        console.error('Error in AppContext getMovieDetails:', error);
        setIsError(true);
        setErrorMessage('Error fetching movie details');
        return null;
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchMovieDetails(params.id);
    }
  }, [params.id]);

  // get tv series details
  useEffect(() => {
    async function fetchTvSeriesDetails(paramId: string | number): Promise<IShow | null> {
      if (!paramId) return null; // Skip if no ID is provided

      try {
        const data = await api.getTvSeriesDetails(paramId as string);
        setTvSeriesDetails(data as unknown as IShow);
        return data as unknown as IShow;
      } catch (error) {
        console.error('Error in AppContext getTvSeriesDetails:', error);
        setIsError(true);
        setErrorMessage('Error fetching tv series details');
        return null;
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchTvSeriesDetails(params.id);
    }
  }, [params.id]);

  // get bookmarked shows
  useEffect(() => {
    async function getBookmarks() {
      try {
        setIsLoading(true);
        const response = await api.getBookmarkedShows();
        const shows = response.data;

        setBookmarks({
          bookmarks: {
            movies: shows.filter(show => show.media_type === 'movie'),
            tvSeries: shows.filter(show => show.media_type === 'tv'),
          },
        });
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setBookmarks(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      getBookmarks();
    }
  }, [isAuthenticated]);

  // return app context
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        shows,
        setShows,
        movies,
        setMovies,
        tvSeries,
        setTvSeries,
        movieDetails,
        setMovieDetails,
        tvSeriesDetails,
        setTvSeriesDetails,
        bookmarks,
        setBookmarks,
        isLoading,
        setIsLoading,
        isError,
        setIsError,
        errorMessage,
        setErrorMessage,
        isSuccess,
        setIsSuccess,
        successMessage,
        setSuccessMessage,
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        setIsAdmin,
        isGuest,
        setIsGuest,
        isUser,
        setIsUser,
        trending,
        setTrending,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// use app context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
