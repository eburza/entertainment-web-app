import axiosConfig from './axiosConfig';
import { ApiResponse, ApiErrorClass } from '../../types/apiResponseType';
import { IShow } from '../../types/interface';

// Define API endpoints
const API_ENDPOINTS = {
  GET_SHOWS: '/',
  GET_MOVIES: '/movies',
  GET_TV_SERIES: '/tv',
  GET_TRENDING: '/',
  SEARCH: '/search',
  GET_BOOKMARKED: '/bookmarked',
  ADD_BOOKMARK: '/bookmarked',
};

// Get all shows
const getAllShows = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_SHOWS);
    return {
      status: response.data.status,
      data: response.data.data.shows,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch shows', 500);
  }
};

// Get all movies
const getMovies = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_MOVIES);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch movies', 500);
  }
};

// Get movie details
const getMovieDetails = async (movieId: string): Promise<ApiResponse<IShow>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_MOVIES}/${movieId}`);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch movie details', 500);
  }
};

// Get all TV series
const getTvSeries = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_TV_SERIES);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch TV series', 500);
  }
};

// Get TV series details
const getTvSeriesDetails = async (tvId: string): Promise<ApiResponse<IShow>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_TV_SERIES}/${tvId}`);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch TV series details', 500);
  }
};

// Get trending shows
const getTrending = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.GET_TRENDING}?trending=true`);
    return {
      status: response.data.status,
      data: response.data.data.trending,
    };
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch trending shows', 500);
  }
};

// Search shows
const searchShows = async (query: string): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(`${API_ENDPOINTS.SEARCH}?query=${query}`);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to search shows', 500);
  }
};

// Get bookmarked shows
const getBookmarkedShows = async (): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_BOOKMARKED);
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to fetch bookmarked shows', 500);
  }
};

// Add show to bookmarks
const addShowToBookmarks = async (showId: string): Promise<ApiResponse<IShow[]>> => {
  try {
    const response = await axiosConfig.post(API_ENDPOINTS.ADD_BOOKMARK, { showId });
    return response.data;
  } catch (error) {
    throw new ApiErrorClass('Failed to add show to bookmarks', 500);
  }
};

export default {
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
