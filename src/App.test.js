import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { Provider } from 'react-redux';
import store from './store';

describe('Default App test', () => {
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<Provider store={store}>
      <App />
    </Provider>, div);
	  ReactDOM.unmountComponentAtNode(div);
	});
});
