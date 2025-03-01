export interface IShow {
  id: string;
  title: string;
  backdrop_path: string;
  year: number;
  category: 'Movie' | 'TV Series';
  rating: string;
  isTrending: boolean;
  isBookmarked: boolean;
  isWatched?: boolean;
  isFavorite?: boolean;
  isMovie?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isBookmarked: IShow[];
  isAdmin: boolean;
  isGuest: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
}

export interface IBookmarkButtonProps {
  isBookmarked: boolean;
}

export interface IBookmarkContext {
  bookmarks: {
    movies: IShow[];
    tvSeries: IShow[];
  };
}

export interface IMediaCardProps {
  backdrop_path: string;
  variant: 'regular' | 'trending';
  title: string;
  year: number;
  category: 'Movie' | 'TV Series';
  rating: string;
  isBookmarked: boolean;
  isWatched?: boolean;
  isFavorite?: boolean;
  isMovie?: boolean;
}

export interface IMediaCardDataProps {
  title?: string;
  imageUrl?: string;
  backdrop_path?: string;
  year?: number;
  category?: 'Movie' | 'TV Series';
  rating?: string;
  isWatched?: boolean;
  isFavorite?: boolean;
}

export interface IIconProps {
  icon: string;
  alt: string;
}

export interface ISwiperComponentProps {
  items: IShow[];
  variant: 'trending' | 'regular';
}

export interface IAppContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  show: IShow | null;
  setShow: (show: IShow | null) => void;
  bookmarks: IBookmarkContext | null;
  setBookmarks: (bookmarks: IBookmarkContext | null) => void;
  trending: IShow[];
  setTrending: React.Dispatch<React.SetStateAction<IShow[]>>;
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
