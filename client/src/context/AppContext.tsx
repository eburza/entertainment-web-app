import React, { createContext, useState, useContext, useEffect } from 'react';
import { IAppContext, IBookmarkContext, IUser, IShow } from '../types/interface';
import { getAllTrending } from '../services/tmdb';
import { useParams } from 'react-router-dom';
const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [show, setShow] = useState<IShow | null>(null);
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
    async function fetchTrending() {
      try {
        const trending = await getAllTrending();
        setTrending(trending as IShow[]);
      } catch (error) {
        setIsError(true);
        setErrorMessage('Error fetching trending');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrending();
  }, []);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const data = await fetch('/api/user');
        const response = await data.json();
        setUser(response);
        setIsSuccess(true);
        setSuccessMessage('User fetched successfully');
      } catch (error) {
        setIsError(true);
        setErrorMessage('Error fetching user');
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin);
      setIsGuest(user.isGuest);
      setIsUser(user.isUser);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsGuest(false);
      setIsUser(false);
    }
  }, [user]);

  async function getBookmarks() {
    setIsLoading(true);
    try {
      const data = await fetch('/api/user/bookmarks');
      const response = await data.json();
      setBookmarks(response);
      setIsSuccess(true);
      setSuccessMessage('Bookmarks fetched successfully');
    } catch (error) {
      setIsError(true);
      setErrorMessage('Error fetching bookmarks');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getBookmarks();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    async function loadShow() {
      setIsLoading(true);
      try {
        const data = await fetch(`/api/show/${params.id}`);
        const response = await data.json();
        setShow(response);
        setIsSuccess(true);
        setSuccessMessage('Show loaded successfully');
      } catch (error) {
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
        show,
        setShow,
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
