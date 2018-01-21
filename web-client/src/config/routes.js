import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

/* Screens */
import HomeScreen from '../screens/Home.jsx';
import Project from '../screens/Project.jsx';
import ConfigScreen from '../screens/Config.jsx';
import AddProject from '../screens/AddProject.jsx';

const Routes = () => (
  <Router>
    <Paths>
      <Route exact path="/" component={HomeScreen} />
      <Route path="/config" component={ConfigScreen} />
      <Route path="/add" component={AddProject} />
      <Route path="/p/:projectId" component={Project} />
    </Paths>
  </Router>
);

const Paths = styled.div`
  font-size: large;
`;

export default Routes;
