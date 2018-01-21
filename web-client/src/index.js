import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { injectGlobal } from 'styled-components';

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
