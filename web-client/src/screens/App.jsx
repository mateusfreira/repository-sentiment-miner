import React, { Component } from 'react';
import styled from 'styled-components';
import Routes from '../config/routes';

class App extends Component {
  render() {
    return (
      <Container>
        <Header>
          <h1>Welcome to Commits miner</h1>
          <h2>
            <HeaderOption href="/"> Home </HeaderOption> |
            <HeaderOption href="/config"> Config </HeaderOption> |
            <HeaderOption href="/add"> Add </HeaderOption> |
          </h2>
        </Header>
        <Routes />
      </Container>
    );
  }
}

const Container = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;

  > h1 {
    font-size: 1.5em;
  }
`;

const HeaderOption = styled.a`
  text-decoration: none;
`;

export default App;
