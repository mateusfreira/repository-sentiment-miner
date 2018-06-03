import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'styled-components';

/* CSS Libs */
import 'sweetalert2/dist/sweetalert2.min.css';

/* Internals */
import App from './screens/App';
import store from './redux/store/index';
import { fetchProjects } from './redux/actions/index';
import registerServiceWorker from './config/registerServiceWorker';

/* Global style */
injectGlobal([
  `
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`
]);

store.dispatch(fetchProjects());

/* eslint react/jsx-filename-extension: 0 */
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
