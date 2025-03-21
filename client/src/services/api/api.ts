import axiosConfig from './axiosConfig';
import { ApiResponse, ApiErrorClass } from '../../types/apiResponseType';
import { IShow, IUser } from '../../types/interface';

// Define API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_CURRENT_USER: '/auth/me',
  // Show endpoints
  GET_SHOWS: '/',
  GET_MOVIES: '/movies',
  GET_TV_SERIES: '/tv',
  GET_TRENDING: '/',
  SEARCH: '/search',
  GET_BOOKMARKED: '/bookmarked',
  ADD_BOOKMARK: '/bookmarked',
};

// Authentication

// Login user
const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: IUser; token: string }>> => {
  try {
    const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, { email, password });
    return {
      status: response.data.status,
      data: response.data.data,
    };
  } catch (error: any) {
    throw new ApiErrorClass(
      error.response?.data?.message || 'Login failed',
      error.response?.status || 500
    );
  }
};

// Register user
const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  try {
    const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, { name, email, password });
    return {
      status: response.data.status,
      data: response.data.data,
    };
  } catch (error: any) {
    throw new ApiErrorClass(
      error.response?.data?.message || 'Registration failed',
      error.response?.status || 500
    );
  }
};

// Get current user
const getCurrentUser = async (): Promise<ApiResponse<{ user: IUser }>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_CURRENT_USER);
    return {
      status: response.data.status,
      data: response.data.data,
    };
  } catch (error: any) {
    throw new ApiErrorClass(
      error.response?.data?.message || 'Failed to get current user',
      error.response?.status || 500
    );
  }
};

// Get all shows
const getAllShows = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_SHOWS);
    console.log('Raw API Response - getAllShows:', response.data);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    console.error('Error in getAllShows:', error);
    throw new ApiErrorClass('Failed to fetch shows', 500);
  }
};

// Get all movies
const getMovies = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_MOVIES);
    console.log('Raw API Response - getMovies:', response.data);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    console.error('Error in getMovies:', error);
    throw new ApiErrorClass('Failed to fetch movies', 500);
  }
};

// Get movie details
const getMovieDetails = async (movieId: string): Promise<ApiResponse<IShow>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_MOVIES}/${movieId}`);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch movie details', 500);
  }
};

// Get all TV series
const getTvSeries = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_TV_SERIES);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch TV series', 500);
  }
};

// Get TV series details
const getTvSeriesDetails = async (tvId: string): Promise<ApiResponse<IShow>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_TV_SERIES}/${tvId}`);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch TV series details', 500);
  }
};

// Get trending shows
const getTrending = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_TRENDING}?trending=true`);
    console.log('Raw API Response - getTrending:', response.data);
    return {
      status: response.data.status,
      data: response.data.data.trending,
    };
  } catch (error) {
    console.error('Error in getTrending:', error);
    throw new ApiErrorClass('Failed to fetch trending shows', 500);
  }
};

// Search shows
const searchShows = async (query: string): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.SEARCH}?query=${query}`);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to search shows', 500);
  }
};

// Get bookmarked shows
const getBookmarkedShows = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_BOOKMARKED);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch bookmarked shows', 500);
  }
};

// Add show to bookmarks
const addShowToBookmarks = async (showId: string): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.post(API_ENDPOINTS.ADD_BOOKMARK, { showId });
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to add show to bookmarks', 500);
  }
};

export default {
  // Auth APIs
  login,
  register,
  getCurrentUser,
  // Show APIs
  getAllShows,
  getMovies,
  getMovieDetails,
  getTvSeries,
  getTvSeriesDetails,
  getTrending,
  searchShows,
  getBookmarkedShows,
  addShowToBookmarks,
};
