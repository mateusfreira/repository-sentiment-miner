import React from 'react';
import ReactDOM from 'react-dom';
import App from './screens/App.jsx';
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

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
