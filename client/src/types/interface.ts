export interface IShow {
  _id: string;
  title: string;
  thumbnail: string;
  year: number;
  category: 'Movie' | 'TV Series';
  rating: string;
  isTrending: boolean;
  isBookmarked: boolean;
}

export interface IUser {
  _id: string;
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

export interface TMDBResponse {
  results: unknown[];
}
