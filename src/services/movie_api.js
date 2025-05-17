import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = `https://api.themoviedb.org/3/`;
const search_URL = `search/movie?api_key=${API_KEY}&language=en-US&query=`;
const trendingMovies_URL = `trending/movie/day?api_key=${API_KEY}&language=en-US`;
const trendingShows_URL = `trending/tv/day?api_key=${API_KEY}`;
const nowPlaying_URL = `movie/now_playing?api_key=${API_KEY}`;
const popularMovies_URL = `movie/popular?api_key=${API_KEY}`;
const popularShow_URL = `tv/popular?api_key=${API_KEY}`;
const topRatedMovies_URL = `movie/top_rated?api_key=${API_KEY}`;
const topRatedTvShows_URL = `tv/top_rated?api_key=${API_KEY}`;
const SearchMovie_URL = `search/movie?api_key=${API_KEY}&query=`;
const SearchShow_URL = `search/tv?api_key=${API_KEY}&query=`;
const moviesGenres_URL = `genre/movie/list?api_key=${API_KEY}`;
const showsGenres_URL = `genre/tv/list?api_key=${API_KEY}`;
const sci_fi_Movies_URL = `discover/movie?api_key=${API_KEY}&with_genres=878`;
const movies_Category_URL = `discover/movie?api_key=${API_KEY}&with_genres=`;
const shows_Category_URL = `discover/tv?api_key=${API_KEY}&with_genres=`;
const airingToday_URL = `tv/airing_today?api_key=${API_KEY}`;
const onGoingShows_URL = `tv/on_the_air?api_key=${API_KEY}`;
const backdropImages_URL = `/images?api_key=${API_KEY}`;

//* Custom error handler
const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error Response:", error.response.data);
    throw new Error(
      `API Error: ${
        error.response.data.status_message || "Unknown error occurred"
      }`
    );
  } else if (error.request) {
    console.error("API Request Error:", error.request);
    throw new Error("Network Error: Please check your internet connection");
  } else {
    console.error("API Error:", error.message);
    throw new Error("An unexpected error occurred");
  }
};
//*Number Formatter
function formatNumber(num) {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num;
  }
}

//*Main Functions

//! For Movies
const getMovies = async (url, type) => {
  try {
    const fetch = await axios.get(`${BASE_URL}${url}`);
    const response = fetch.data.results;
    return response
      .filter(
        (movie) =>
          movie.poster_path != null &&
          movie.backdrop_path != null &&
          movie.overview !== ""
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        banner: movie.backdrop_path,
        poster: movie.poster_path,
        overview: movie.overview,
        type: type,
      }));
  } catch (error) {
    handleApiError(error);
  }
};
//! For Shows
const getShows = async (url, type) => {
  try {
    const fetch = await axios.get(`${BASE_URL}${url}`);
    const response = fetch.data.results;
    return response
      .filter(
        (movie) =>
          movie.backdrop_path != null &&
          movie.poster_path != null &&
          movie?.name != "When Life Gives You Tangerines"
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.name,
        banner: movie.backdrop_path,
        release_date: movie.first_air_date,
        poster: movie.poster_path,
        overview: movie.overview,
        type: type,
      }));
  } catch (error) {
    handleApiError(error);
  }
};
//! For Movies with Multiple Pages
const getMoviesWithPage = async (url, type) => {
  try {
    const allMovies = [];
    const totalPages = 9;

    for (let page = 1; page <= totalPages; page++) {
      const fetch = await axios.get(`${BASE_URL}${url}&page=${page}`);
      const response = fetch.data.results;

      const movies = response
        .filter(
          (movie) => movie.poster_path != null && movie.backdrop_path !== null
        )
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          banner: movie.backdrop_path,
          poster: movie.poster_path,
          overview: movie.overview,
          type: type,
        }));

      allMovies.push(...movies);
    }
    return allMovies;
  } catch (error) {
    handleApiError(error);
  }
};
//! For Shows with Multiple Pages
const getShowsWithPage = async (url, type) => {
  try {
    const allShows = [];
    const totalPages = 9;

    for (let page = 1; page <= totalPages; page++) {
      const fetch = await axios.get(`${BASE_URL}${url}&page=${page}`);
      const response = fetch.data.results;

      const shows = response
        .filter(
          (movie) => movie.poster_path != null && movie.backdrop_path != null
        )
        .map((movie) => ({
          id: movie.id,
          title: movie.name,
          release_date: movie.first_air_date,
          banner: movie.backdrop_path,
          poster: movie.poster_path,
          overview: movie.overview,
          type: type,
        }));

      allShows.push(...shows);
    }
    return allShows;
  } catch (error) {
    handleApiError(error);
  }
};

//*Queries
export const getTrendingMovies = async () => {
  return getMovies(trendingMovies_URL, "movie");
};
export const getTrendingShows = async () => {
  return getShows(trendingShows_URL, "show");
};

export const getNowPlayingMovies = async () => {
  return getMovies(nowPlaying_URL, "movie");
};
export const getPopularMovies = async () => {
  return getMovies(popularMovies_URL, "movie");
};
export const getScienceFictionMovies = async () => {
  return getMovies(sci_fi_Movies_URL, "movie");
};

export const getTopRatedTvShows = async () => {
  return getShows(topRatedTvShows_URL, "show");
};
export const getTopRatedMovies = async () => {
  return getMovies(topRatedMovies_URL, "movie");
};

export const getAnimatedMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 16, "movie");
};

export const getAnimatedShows = async () => {
  return getShowsWithPage(shows_Category_URL + 16, "show");
};
export const getActionMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 28, "movie");
};

export const getActionShows = async () => {
  return getShowsWithPage(shows_Category_URL + 10759, "show");
};
export const getHorrorMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 27, "movie");
};

export const getHorrorShows = async () => {
  return getShowsWithPage(shows_Category_URL + 27, "show");
};

export const getDramaMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 18, "movie");
};

export const getDramaShows = async () => {
  return getShowsWithPage(shows_Category_URL + 18, "show");
};

export const getAdventureMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 12, "movie");
};

export const getAdventureShows = async () => {
  return getShowsWithPage(shows_Category_URL + 10759, "show");
};

export const getComedyMovies = async () => {
  return getMoviesWithPage(movies_Category_URL + 35, "movie");
};

export const getComedyShows = async () => {
  return getShowsWithPage(shows_Category_URL + 35, "show");
};

export const getTodayShows = async () => {
  return getShows(airingToday_URL, "show");
};
export const getOnGoingShows = async () => {
  return getShows(onGoingShows_URL, "show");
};

export const getPopularShow = async () => {
  return getShows(popularShow_URL, "show");
};

export const getSearchResult = async (query) => {
  try {
    const [fetch, fetch2] = await Promise.all([
      axios.get(`${BASE_URL}${SearchMovie_URL}${query}`),
      axios.get(`${BASE_URL}${SearchShow_URL}${query}`),
    ]);

    const response = [...fetch.data.results, ...fetch2.data.results];

    return response
      .filter(
        (movie) => movie.poster_path != null && movie.backdrop_path != null
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.name ? movie.name : movie.title,
        release_date: movie.first_air_date || movie.release_date,
        banner: movie.backdrop_path,
        poster: movie.poster_path,
        overview: movie.overview,
        type: movie.name ? "show" : "movie",
      }));
  } catch (error) {
    handleApiError(error);
  }
};
export const getTopRated = async () => {
  try {
    const fetch = await axios.get(`${BASE_URL}${topRatedMovies_URL}`);
    const fetch2 = await axios.get(`${BASE_URL}${topRatedTvShows_URL}`);

    const response = [...fetch2.data.results, ...fetch.data.results];

    //!  Fisher-Yates Shuffle
    for (let i = response.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [response[i], response[j]] = [response[j], response[i]];
    }

    return response
      .filter(
        (movie) =>
          movie.backdrop_path != null &&
          movie.poster_path != null &&
          movie?.name != "When Life Gives You Tangerines"
      )
      .map((movie) => ({
        id: movie.id,
        title: movie.title || movie.name,
        release_date: movie.release_date || movie.first_air_date,
        banner: movie.backdrop_path,
        poster: movie.poster_path,
        overview: movie.overview,
        type: movie.name ? "show" : "movie",
      }));
  } catch (error) {
    handleApiError(error);
  }
};
export const getImageURL = async () => {
  try {
    const fetch = await axios.get(
      `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`
    );
    return {
      url: fetch.data.images.secure_base_url,
      sizes: fetch.data.images.poster_sizes,
      banner_sizes: fetch.data.images.backdrop_sizes,
    };
  } catch (error) {
    handleApiError(error);
  }
};
export const getMoviesGenres = async () => {
  try {
    const fetch = await axios.get(`${BASE_URL}${moviesGenres_URL}`);
    return fetch.data.genres;
  } catch (error) {
    handleApiError(error);
  }
};
export const getShowsGenres = async () => {
  try {
    const fetch = await axios.get(`${BASE_URL}${showsGenres_URL}`);
    return fetch.data.genres;
  } catch (error) {
    handleApiError(error);
  }
};
export const getFliteredMovies = async (genre, type) => {
  try {
    const allMovies = [];
    const totalPages = 9;

    for (let page = 1; page <= totalPages; page++) {
      const fetch = await axios.get(
        `${BASE_URL}${movies_Category_URL}${genre}&page=${page}`
      );
      const response = fetch.data.results;

      const filteredMovies = response
        .filter(
          (movie) => movie.poster_path != null && movie.backdrop_path != null
        )
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          banner: movie.backdrop_path,
          poster: movie.poster_path,
          overview: movie.overview,
          type: type,
        }));

      allMovies.push(...filteredMovies);
    }

    return allMovies;
  } catch (error) {
    handleApiError(error);
  }
};
export const getFliteredShows = async (genre, type) => {
  try {
    const allShows = [];
    const totalPages = 9;

    for (let page = 1; page <= totalPages; page++) {
      const fetch = await axios.get(
        `${BASE_URL}${shows_Category_URL}${genre}&page=${page}`
      );
      const response = fetch.data.results;

      const filteredShows = response
        .filter(
          (show) => show.poster_path != null && show.backdrop_path != null
        )
        .map((show) => ({
          id: show.id,
          title: show.name,
          release_date: show.first_air_date,
          banner: show.backdrop_path,
          poster: show.poster_path,
          overview: show.overview,
          type: type,
        }));

      allShows.push(...filteredShows);
    }

    return allShows;
  } catch (error) {
    handleApiError(error);
  }
};
export const getMovieDetails = async (id) => {
  try {
    const fetch = await axios.get(`${BASE_URL}movie/${id}?api_key=${API_KEY}`);
    const response = fetch.data;
    const movieinfo = {
      title: response.title,
      tagline: response.tagline,
      genres: response.genres.map((genre) =>
        genre.name == "Science Fiction" ? "Sci-Fi" : genre.name
      ),
      banner: response.backdrop_path,
      poster: response.poster_path,
      budget: formatNumber(response.budget),
      ticket: response.homepage,
      overview: response.overview,
      productionCompanies: response.production_companies.map((c) => c.name),
      release: response.release_date,
      revenue: formatNumber(response.revenue),
      runtime: response.runtime,
      spoken_languages: response.spoken_languages.map(
        (lang) => lang.english_name
      ),
      status: response.status,
      rating: response.vote_average,
      vote: response.vote_count,
    };
    return movieinfo;
  } catch (error) {
    handleApiError(error);
  }
};
export const getShowDetails = async (id) => {
  const fetch = await axios.get(`${BASE_URL}tv/${id}?api_key=${API_KEY}`);
  const response = fetch.data;
  const showInfo = {
    title: response.name,
    tagline: response.tagline,
    genres: response.genres.map((genre) =>
      genre.name == "Science Fiction" ? "Sci-Fi" : genre.name
    ),
    banner: response.backdrop_path,
    poster: response.poster_path,
    ticket: response.homepage,
    overview: response.overview,
    productionCompanies: response.production_companies.map((c) => c.name),
    release: response.first_air_date,
    lastRelease: response.last_air_date,
    nextEpisode: response.next_episode_to_air,
    numofEpisode: response.number_of_episodes,
    totalSeason: response.seasons,
    spoken_languages: response.spoken_languages.map(
      (lang) => lang.english_name
    ),
    status: response.status,
    type: response.type,
    rating: response.vote_average,
    vote: response.vote_count,
  };
  console.log(showInfo);
  return showInfo;
};
export const getBackDropImages = async (id, type) => {
  try {
    const fetch = await axios.get(
      `${BASE_URL}${type}/${id}${backdropImages_URL}`
    );

    const response = fetch.data.backdrops;

    return response.map((data) => data.file_path);
  } catch (error) {
    handleApiError(error);
  }
};
// export const getShowDetails = async (id) => {
//   try {
//     const fetch = await axios.get(`${BASE_URL}tv/${id}?api_key=${API_KEY}`);
//     const response = fetch.data;
//     console.log(response);
//     // const movieinfo = {
//     //   title: response.original_title,
//     //   tagline: response.tagline,
//     //   genres: response.genres.map((genre) =>
//     //     genre.name == "Science Fiction" ? "Sci-Fi" : genre.name
//     //   ),
//     //   banner: response.backdrop_path,
//     //   poster: response.poster_path,
//     //   budget: formatNumber(response.budget),
//     //   ticket: response.homepage,
//     //   overview: response.overview,
//     //   productionCompanies: response.production_companies.map((c) => c.name),
//     //   release: response.release_date,
//     //   revenue: formatNumber(response.revenue),
//     //   runtime: response.runtime,
//     //   spoken_languages: response.spoken_languages.map(
//     //     (lang) => lang.english_name
//     //   ),
//     //   status: response.status,
//     //   rating: response.vote_average,
//     // };
//     // return movieinfo;
//   } catch (error) {
//     handleApiError(error);
//   }
// };
