import axios from 'axios';
const initialState = { movies: [], genres: [] };

export const LOAD_MOVIES = 'LOAD_MOVIES';
export const LOAD_GENRES = 'LOAD_GENRES';

export function reducer(state = initialState, action) {
  switch ( action.type ) {
    case LOAD_MOVIES:
      const currentMovies = [ ...state.movies ];
      if (currentMovies.length === 0) {
        currentMovies.push(action.payload);
        return { ...state, movies: currentMovies };
      }

      const movieAddedBefore = currentMovies.find((movie) => {
        return movie.id === action.payload.id; 
      })

      if (!movieAddedBefore) {
        currentMovies.push(action.payload)
      }

      //console.log('payload', action.payload)

      return { ...state, movies: currentMovies };

    case LOAD_GENRES:
      return { ...state, genres: action.payload.genres }
    default:
      return state;
  }
}

export function getMovies(payload) {
  return {
    type: LOAD_MOVIES,
    payload
  }
}

export function getGenres(payload) {
  return {
    type: LOAD_GENRES,
    payload
  }
}

export function fetchMovieGenres() {
  return(dispatch) => {
    return axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=7998cc6141393eddb26362b471bf6041&language=en-US').then((res) => {
         dispatch(getGenres(res.data));
      });
  }
}

export function fetchMovieData(payload) {
  return(dispatch) => {
    return payload.results.map((movie) => {
      return axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=7998cc6141393eddb26362b471bf6041&language=en-US&append_to_response=credits,release_dates`).then((res) => {
        dispatch(getMovies(res.data));
      });
    })
  }
}

export function fetchPopularMovies(pages) {
  return(dispatch) => {
    return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=7998cc6141393eddb26362b471bf6041&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pages}`).then((res) => {
      dispatch(fetchMovieData(res.data));
      if (pages > 1) {
        dispatch(fetchPopularMovies(pages - 1));
      }
    });
  }
}

export function searchMoviesWithName(payload, pages) {
  const searchString = payload.replace(' ', '%20');
  return(dispatch) => {
    return axios.get(`https://api.themoviedb.org/3/search/movie?api_key=7998cc6141393eddb26362b471bf6041&language=en-US&query=${searchString}&page=1&include_adult=false&page=${pages}`).then((res) => {
      dispatch(fetchMovieData(res.data));
      if (pages > 1) {
        dispatch(searchMoviesWithName(payload, pages - 1));
      }
    });
  }
}

export function searchMoviesWithGenre(payload, pages) {
  return(dispatch) => {
    return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=7998cc6141393eddb26362b471bf6041&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${payload}&page=${pages}`).then((res) => {
      dispatch(fetchMovieData(res.data));
      if (pages > 1) {
        dispatch(searchMoviesWithGenre(payload, pages - 1));
      }
    });
  }
}