import React, { Component } from 'react';
import { connect } from 'react-redux';
import SaveFile from 'save-file';
import './App.css';

import store from './store';
import * as Counter from './action-reducers/counter';
import * as Movies from './action-reducers/movies';

import Button from './components/Button/Button';

const mapStateToProps = state => {
  return {
    movies: state.movies.movies,
    genres: state.movies.genres
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: '',
      movieName: '',
      selectedType: 'popular',
      maxMovies: 20,
      genres: [],
      genre: ''
    }
  }

  handleFileNameChange = (e) => {
    this.setState({ fileName: e.target.value });
  }

  handleMovieNameChange = (e) => {
    this.setState({ movieName: e.target.value });
  }

  handleGenreChange = (e) => {
    this.setState({ genre: e.target.value });
  }

  increase = () => {
    store.dispatch(Counter.increment());
  }

  decrease = () => {
    store.dispatch(Counter.decrement());
  }

  save = () => {
    const newArray = this.props.movies.map((movie) => {
      let director = '';
      let ageRating = '';

      if (movie.credits && movie.credits.crew) {
        director = movie.credits.crew.find((crew) => {
          return crew.job === "Director";
        });
      }

      if (movie.release_dates && movie.release_dates.results) {
        const ageRatingUS = movie.release_dates.results.find((iso) => {
          return iso.iso_3166_1 === "US";
        });

        if ( ageRatingUS ) {
          ageRating = ageRatingUS.release_dates.find((rating) => {
            return rating && rating.certification !== '';
          });
        }
      }
      
      return {
        title: movie.title ? movie.title : '',
        overview: movie.overview ? movie.overview : '',
        year: movie.release_date ? movie.release_date.substr(0, 4) : '',
        runtime: movie.runtime? movie.runtime.toString() : '',
        cast1: movie.credits && movie.credits.cast && movie.credits.cast[0] ? movie.credits.cast[0].name : '',
        character1: movie.credits && movie.credits.cast && movie.credits.cast[0] ? movie.credits.cast[0].character : '',
        cast2: movie.credits && movie.credits.cast && movie.credits.cast[1] ?  movie.credits.cast[1].name : '',
        character2: movie.credits && movie.credits.cast && movie.credits.cast[1] ? movie.credits.cast[1].character : '',
        cast3: movie.credits && movie.credits.cast && movie.credits.cast[2] ? movie.credits.cast[2].name : '',
        character3: movie.credits && movie.credits.cast && movie.credits.cast[2] ? movie.credits.cast[2].character : '',
        cast4: movie.credits && movie.credits.cast && movie.credits.cast[3] ? movie.credits.cast[3].name : '',
        character4: movie.credits && movie.credits.cast && movie.credits.cast[3] ? movie.credits.cast[3].character : '',
        director: director.name,
        age_rating: ageRating && ageRating.certification ? ageRating.certification : '',
        user_score: movie.vote_average ? movie.vote_average.toString() : '',
        genre1: movie.genres[0] ? movie.genres[0].name : '',
        genre2: movie.genres[1] ? movie.genres[1].name : '',
        genre3: movie.genres[2] ? movie.genres[2].name : '',
        genre4: movie.genres[3] ? movie.genres[3].name : '',
        backdrop_original: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
        backdrop_w300: movie.backdrop_path ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}` : '',
        backdrop_w780: movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : '',
        backdrop_w1280: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '',
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '',
      }
    })

    //console.log('Result', newArray)

    const newJson = JSON.stringify(newArray, null, 2);
    const fileName = this.state.fileName !== '' ? this.state.fileName : 'jonasMovieJson';

    SaveFile(newJson, `${fileName}.json`, (err, newJson) => {
        if (err) throw err;
    });
  }

  getPopular = () => {
    store.dispatch(Movies.fetchPopularMovies(this.state.maxMovies/20));
  }

  getMoviesWithName = () => {
    store.dispatch(Movies.searchMoviesWithName(this.state.movieName, this.state.maxMovies/20));
    this.setState({ movieName: '' })
  }

  getMoviesWithGenre = () => {
    store.dispatch(Movies.searchMoviesWithGenre(this.state.genre, this.state.maxMovies/20));
    this.setState({ genre: '' })
  }

  getGenres = () => {
    store.dispatch(Movies.fetchMovieGenres());
  }

  handleSelectType = (e) => {
    this.setState({ selectedType: e.target.value })
    if (e.target.value === 'genre') {
      this.getGenres();
    }
  }

  handleAddClick = () => {
    const selectedType = this.state.selectedType;
    if (selectedType === 'popular') {
      this.getPopular();
    } else if (selectedType === 'movieName') {
      if (this.state.movieName === '') {
        window.alert("Add som text before adding");
      } else {
        this.getMoviesWithName();
      }  
    } else if ( selectedType === 'genre' ) {
      this.getMoviesWithGenre();
    }
  }

  handleMaxMoviesChange = (e) => {
    this.setState({ maxMovies: e.target.value});
  }

  render() {
    let genres = [];

    if (this.props.genres) {
      genres = this.props.genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)
    }
    
    return (
      <div className="app">
        <div className="app__info">
          <h1> 
            <span className="app__title">Hi Jonas! </span>
            <span className="app__title--small">Or other user</span>
          </h1>
          <p>Here you can build a json with movie data from <a href="https://www.themoviedb.org">themoviedb</a></p>
          <p>When you add a new parameter you will add all the results avalible and up to the max nbr you set. No dublicates will be added</p>
        </div>
        <form>
          <fieldset>
            <legend>Select what kind of movies you want to add</legend>

            <div>
              <label>
                <input type="radio" value="popular" checked={this.state.selectedType === 'popular'} onChange={this.handleSelectType} />
                Popular
              </label>
            </div>

            <div>
              <label>
                <input type="radio" value="movieName" checked={this.state.selectedType === 'movieName'} onChange={this.handleSelectType} />
                Title that includes
                <input value={this.state.movieName} onChange={this.handleMovieNameChange} />
              </label>
            </div>

            <div>
              <label>
                <input type="radio" value="genre" checked={this.state.selectedType === 'genre'} onChange={this.handleSelectType} />
                By genre
                <select defaultValue="Choose genre" onChange={this.handleGenreChange}>
                  {genres}
                </select>
              </label>
            </div>

          </fieldset>
        </form>
        <div>
          <label>
            Add max: 
            <select defaultValue={this.state.maxMovies} onChange={this.handleMaxMoviesChange}>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <div>
          <Button title='Add' onClick={this.handleAddClick} />
        </div>
        <div>
          <p>You have added {this.props.movies.length} movies</p>
        </div>
        <div>
          <label htmlFor="fileName">Name your file</label>
          <input id="fileName" value={this.state.fileName} onChange={this.handleFileNameChange} />
          <Button title='Save' onClick={this.save} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);