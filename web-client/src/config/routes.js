import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

/* Screens */
import HomeScreen from '../screens/Home.jsx';
import Project from '../screens/Project.jsx';
import ConfigScreen from '../screens/Config.jsx';
import AddProject from '../screens/AddProject.jsx';

const Routes = () => (
  <Paths>
    <Route exact path="/" component={HomeScreen} />
    <Route path="/config" component={ConfigScreen} />
    <Route path="/add" component={AddProject} />
    <Route exact path="/project/:projectId" component={Project} />
  </Paths>
);

const Paths = styled.div`
  font-size: large;
`;

export default Routes;
