import { TMDBResponse } from '../types/interface';

const TMDB_API_ACCESS_TOKEN = process.env.REACT_APP_TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

//get all shows
export async function getAllShows() {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc`,
        options
      ),
      fetch(
        `${TMDB_BASE_URL}/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc`,
        options
      ),
    ]);

    if (!moviesResponse || !tvResponse) {
      throw new Error('Failed to fetch shows');
    }
    const [moviesData, tvData] = await Promise.all([moviesResponse.json(), tvResponse.json()]);

    const moviesReceived = moviesData.results;
    const tvReceived = tvData.results;

    const allShows = [...moviesReceived, ...tvReceived].sort(() => Math.random() - 0.5);

    return allShows;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
}

// get movies
export async function getMovies() {
  try {
    const url = `${TMDB_BASE_URL}/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc`;
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

//get tv series
export async function getTvSeries() {
  try {
    const url = `${TMDB_BASE_URL}/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc`;
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

//get movies details
export async function getMovieDetails(movieId: string) {
  try {
    const url = `${TMDB_BASE_URL}//movie/${movieId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as TMDBResponse;
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

//get tv series details
export async function getTvSeriesDetails(tvId: string) {
  try {
    const url = `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as TMDBResponse;
    return data;
  } catch (error) {
    console.error('Error fetching tv series details:', error);
    throw error;
  }
}

// get all trending
export async function getAllTrending() {
  try {
    const url = `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw error;
  }
}

// search by keyword
export async function searchByKeyword(query: string) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/keyword?query=${query}&page=1`, options);
    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error('Error searching media:', error);
    throw error;
  }
}

// export const getMovie = async (id: string) => {
//   const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
//   const data = await response.json();
//   return data;
// };

// export const getTv = async (id: string) => {
//   const response = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
//   const data = await response.json();
//   return data;
// };
