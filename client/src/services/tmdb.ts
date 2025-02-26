import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { TMDBResponse } from '../types/interface';

dotenv.config();

const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
  },
};

// get all trending
export async function getAllTrending() {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/all/day?language=en-US`, options);
    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

// search by keyword
export async function searchByKeyword(query: string) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/keyword?query=${query}&page=1`, options);
    const data = (await response.json()) as TMDBResponse;
    return data.results;
  } catch (error) {
    console.error(error);
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
