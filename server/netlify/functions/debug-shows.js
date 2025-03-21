const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

exports.handler = async (event, context) => {
  try {
    // Fetch movies from TMDB
    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    // Map the data to the format your frontend expects
    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop_path: movie.backdrop_path || '',
      year: new Date(movie.release_date).getFullYear(),
      category: 'Movie',
      media_type: 'movie',
      rating: 'PG',
      vote_average: movie.vote_average || 0,
      isTrending: movie.popularity > 1000,
      isBookmarked: false,
    }));
    
    // Return the data with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        data: {
          shows: movies
        }
      })
    };
  } catch (error) {
    console.error('Error fetching shows:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to fetch shows'
      })
    };
  }
};
