import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";

import * as Counter from '../action-reducers/counter';

const rootReducer = combineReducers({ counter: Counter.reducer });

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;