export interface IShow {
  name: string;
  id: string;
  title: string;
  backdrop_path: string;
  year: number;
  media_type: 'movie' | 'tv';
  vote_average: number;
  isTrending: boolean;
  isBookmarked: boolean;
  isWatched?: boolean;
  isFavorite?: boolean;
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
  media_type: 'movie' | 'tv';
  variant: 'regular' | 'trending';
  title: string;
  year: number;
  rating: number;
  isBookmarked: boolean;
  isWatched?: boolean;
  isFavorite?: boolean;
}

export interface IMediaCardDataProps {
  title?: string;
  imageUrl?: string;
  backdrop_path?: string;
  year?: number;
  media_type?: 'movie' | 'tv';
  rating?: number;
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
  shows: IShow[] | null;
  setShows: React.Dispatch<React.SetStateAction<IShow[]>>;
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
