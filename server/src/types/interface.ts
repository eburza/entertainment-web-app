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
  isAdmin: boolean;
  isGuest: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
}