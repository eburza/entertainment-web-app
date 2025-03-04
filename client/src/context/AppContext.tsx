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
