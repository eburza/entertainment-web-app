export interface IShow {
  id: string;
  title: string;
  thumbnail: string;
  year: number;
  category: 'Movie' | 'TV Series';
  rating: string;
  isTrending: boolean;
  isBookmarked: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isBookmarked: IShow[];
}

export interface IBookmarkContext {
  bookmarks: {
    movies: IShow[];
    tvSeries: IShow[];
  };
}

export interface IAppContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  bookmarks: IBookmarkContext | null;
  setBookmarks: (bookmarks: IBookmarkContext | null) => void;
  isLoading: boolean | null;
  setIsLoading: (isLoading: boolean) => void;
  isError: boolean | null;
  setIsError: (isError: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string) => void;
  isSuccess: boolean | null;
  setIsSuccess: (isSuccess: boolean) => void;
  successMessage: string | null;
  setSuccessMessage: (successMessage: string) => void;
  isAuthenticated: boolean | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isAdmin: boolean | null;
  setIsAdmin: (isAdmin: boolean) => void;
  isGuest: boolean | null;
  setIsGuest: (isGuest: boolean) => void;
  isUser: boolean | null;
  setIsUser: (isUser: boolean) => void;
}

export interface TMDBResponse {
  results: unknown[];
}
