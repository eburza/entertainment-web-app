import React, { createContext, useState, useContext, useEffect } from 'react';
import { IAppContext, IBookmarkContext, IUser, IShow } from '../types/interface';
import {
  getAllTrending,
  getAllShows,
  getMovies,
  getTvSeries,
  getMovieDetails,
  getTvSeriesDetails,
} from '../services/tmdb';
import { useParams } from 'react-router-dom';
const AppContext = createContext<IAppContext | undefined>(undefined);

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

  const params = useParams();

  useEffect(() => {
    async function getShows() {
      try {
        setIsLoading(true);
        const data = await getAllShows();
        setShows(data as IShow[]);
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

  useEffect(() => {
    async function getTrending() {
      try {
        setIsLoading(true);
        const data = await getAllTrending();
        setTrending(data as IShow[]);
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

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getMovies();
        setMovies(data as IShow[]);
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

  useEffect(() => {
    async function fetchTvSeries() {
      try {
        const data = await getTvSeries();
        setTvSeries(data as IShow[]);
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

  useEffect(() => {
    async function fetchMovieDetails(paramId: string | number): Promise<IShow | null> {
      if (!paramId) return null; // Skip if no ID is provided

      try {
        const data = await getMovieDetails(paramId as string);
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

  useEffect(() => {
    async function fetchTvSeriesDetails(paramId: string | number): Promise<IShow | null> {
      if (!paramId) return null; // Skip if no ID is provided

      try {
        const data = await getTvSeriesDetails(paramId as string);
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

  useEffect(() => {
    async function getBookmarks() {
      try {
        // Check if we're in development mode without backend
        if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_BASE_URL) {
          console.warn(
            'Backend API is not configured for getBookmarks. Using mock data or skipping'
          );
          setBookmarks(null);
          return;
        }

        const data = await fetch('/api/user/bookmarks');
        if (!data.ok) {
          throw new Error(`API responded with status: ${data.status}`);
        }
        const response = await data.json();
        setBookmarks(response);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        // Silently fail and set bookmarks to null
        setBookmarks(null);
      }
    }

    getBookmarks();
  }, []);

  // TODO: Implement user authentication
  // useEffect(() => {
  //   async function getUser() {
  //     setIsLoading(true);
  //     try {
  //       const data = await fetch('/api/user');
  //       const response = await data.json();
  //       setUser(response);
  //       setIsSuccess(true);
  //       setSuccessMessage('User fetched successfully');
  //     } catch (error) {
  //       setIsError(true);
  //       setErrorMessage('Error fetching user');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   getUser();
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     setIsAuthenticated(true);
  //     setIsAdmin(user.isAdmin);
  //     setIsGuest(user.isGuest);
  //     setIsUser(user.isUser);
  //   } else {
  //     setIsAuthenticated(false);
  //     setIsAdmin(false);
  //     setIsGuest(false);
  //     setIsUser(false);
  //   }
  // }, [user]);

  // async function getBookmarks() {
  //   setIsLoading(true);
  //   try {
  //     const data = await fetch('/api/user/bookmarks');
  //     const response = await data.json();
  //     setBookmarks(response);
  //     setIsSuccess(true);
  //     setSuccessMessage('Bookmarks fetched successfully');
  //   } catch (error) {
  //     setIsError(true);
  //     setErrorMessage('Error fetching bookmarks');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     getBookmarks();
  //   }
  // }, [isAuthenticated]);

  // load show
  useEffect(() => {
    async function loadShow() {
      if (!params.id) return; // Skip if no ID is provided

      setIsLoading(true);
      try {
        // Check if we're in development mode without backend
        if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_BASE_URL) {
          console.warn('Backend API is not configured. Using mock data');
          // Set mock data or handle this case as needed
          setShows([]);
          return;
        }

        const data = await fetch(`/api/show/${params.id}`);
        if (!data.ok) {
          throw new Error(`API responded with status: ${data.status}`);
        }
        const response = await data.json();
        setShows(response);
        setIsSuccess(true);
        setSuccessMessage('Show loaded successfully');
      } catch (error) {
        console.error('Error loading show:', error);
        setIsError(true);
        setErrorMessage('Error loading show');
      } finally {
        setIsLoading(false);
      }
    }

    loadShow();
  }, [params.id]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
