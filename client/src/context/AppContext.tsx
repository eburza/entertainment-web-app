import React, { createContext, useState, useContext } from 'react';
import { IAppContext, IBookmarkContext, IUser } from '../types/interface';

const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [bookmarks, setBookmarks] = useState<IBookmarkContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
