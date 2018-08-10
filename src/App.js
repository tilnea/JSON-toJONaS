import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import store from './store';
import * as Counter from './action-reducers/counter';

import Button from './components/Button/Button';

const mapStateToProps = state => {
  return {
    count: state.counter.count,
  };
};

class App extends Component {
  increase = () => {
    store.dispatch(Counter.increment());
  }

  decrease = () => {
    store.dispatch(Counter.decrement());
  }

  render() {
    return (
      <div className="app">
        <div className="app__buttons">
          <Button title='-' onClick={this.decrease} />
          <Button title='+' onClick={this.increase} />
        </div>
        <h1>{ this.props.count }</h1>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);