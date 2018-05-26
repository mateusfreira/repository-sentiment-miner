import React from 'react';
import ReactDOM from 'react-dom';
import App from './screens/App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store/index.js';
import { fetchProjects } from './redux/actions/index.js';
import registerServiceWorker from './config/registerServiceWorker';
import { injectGlobal } from 'styled-components';

/* CSS Libs */
import 'sweetalert2/dist/sweetalert2.min.css';

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
store.dispatch(fetchProjects()).then(console.log);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
