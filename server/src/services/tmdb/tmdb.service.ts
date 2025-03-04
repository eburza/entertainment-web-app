import axios from 'axios';
import { TMDBResponse } from '../../types/tmdbTypes';

//get the environment variables
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

//create the axios instance
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

//create the service
export const tmdbService = {
  // Get all shows (movies and TV series)
  async getAllShows() {
    try {
      console.log('Fetching all shows...');
      const [moviesResponse, tvResponse] = await Promise.all([
        tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc'),
        tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc')
      ]);

      console.log('Movies response status:', moviesResponse.status);
      console.log('TV response status:', tvResponse.status);

      const moviesReceived = moviesResponse.data.results.map((movie: TMDBResponse) => ({
        ...movie,
        media_type: 'movie',
      }));

      const tvReceived = tvResponse.data.results.map((series: TMDBResponse) => ({
        ...series,
        media_type: 'tv',
      }));

      const result = [...moviesReceived, ...tvReceived].sort(() => Math.random() - 0.5);
      console.log(`Successfully fetched ${result.length} shows`);
      return result;
    } catch (error) {
      console.error('Error fetching shows:', error);
      throw new Error('Failed to fetch shows');
    }
  },

  // Get movies
  async getMovies() {
    try {
      console.log('Fetching movies...');
      const response = await tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc');
      console.log('Movies response status:', response.status);
      
      const result = response.data.results.map((movie: TMDBResponse) => ({
        ...movie,
        media_type: 'movie',
      }));
      console.log(`Successfully fetched ${result.length} movies`);
      return result;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  },

  // Get TV series
  async getTvSeries() {
    try {
      const response = await tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc');
      return response.data.results.map((series: TMDBResponse) => ({
        ...series,
        media_type: 'tv',
      }));
    } catch (error) {
      throw new Error('Failed to fetch TV series');
    }
  },

  // Get movie details
  async getMovieDetails(movieId: string) {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch movie details');
    }
  },

  // Get TV series details
  async getTvSeriesDetails(tvId: string) {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch TV series details');
    }
  },

  // Get all trending
  async getAllTrending() {
    try {
      console.log('Fetching trending shows...');
      const response = await tmdbApi.get('/trending/all/day');
      console.log('Trending response status:', response.status);
      
      const result = response.data.results;
      console.log(`Successfully fetched ${result.length} trending shows`);
      return result;
    } catch (error) {
      console.error('Error fetching trending shows:', error);
      throw new Error('Failed to fetch trending shows');
    }
  },

  // Search by keyword
  async searchByKeyword(query: string) {
    try {
      console.log(`Searching for "${query}"...`);
      const [movieResults, tvResults] = await Promise.all([
        tmdbApi.get(`/search/movie?query=${query}&include_adult=false&language=en-US&page=1`),
        tmdbApi.get(`/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
      ]);
      
      const movies = movieResults.data.results.map((movie: TMDBResponse) => ({
        ...movie,
        media_type: 'movie',
      }));
      
      const tvShows = tvResults.data.results.map((series: TMDBResponse) => ({
        ...series,
        media_type: 'tv',
      }));
      
      const combinedResults = [...movies, ...tvShows];
      console.log(`Found ${combinedResults.length} results for "${query}"`);
      return combinedResults;
    } catch (error) {
      console.error('Error searching shows:', error);
      throw new Error('Failed to search shows');
    }
  }
}; 
