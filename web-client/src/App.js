import React, { Component } from 'react';
import ProjectsTable from './ProjectsTable.js';
import Project from './Project.js';
import ConfigForm from './ConfigForm.js';
import AddProject from './AddProject.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

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
        <Router>
          <Paths>
            <Route path="/" exact component={ProjectsTable} />
            <Route path="/config" exact component={ConfigForm} />
            <Route path="/add" exact component={AddProject} />
            <Route path="/p/:projectId" component={Project} />
          </Paths>
        </Router>
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

const Paths = styled.div`
  font-size: large;
`;

export default App;
