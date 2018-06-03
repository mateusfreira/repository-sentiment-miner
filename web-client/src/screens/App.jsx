import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styled from 'styled-components';
import Routes from '../config/Routes';
import Header from '../components/Header';

const App = () => (
  <MuiThemeProvider>
    <Router>
      <Container>
        <Header />
        <Routes />
      </Container>
    </Router>
  </MuiThemeProvider>
);

const Container = styled.div`
  text-align: center;
`;

export default App;
