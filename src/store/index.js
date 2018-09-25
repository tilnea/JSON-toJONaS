import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";

import * as Counter from '../action-reducers/counter';
import * as Movies from '../action-reducers/movies';

const rootReducer = combineReducers({ counter: Counter.reducer, movies: Movies.reducer });

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;