import React, { Component } from 'react';
import './App.css';
import ProjectTable from './ProjecsTable.js';
import Project from './Projec.js';
import ConfigForm from './ConfigForm.js';
import AddProject from './AddProject.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Commits miner</h1>
          <h2>
            <a href="/"> Home </a> |
            <a href="/config"> Config </a> |
            <a href="/add"> Add </a> |
          </h2>
        </header>
        <Router>
          <p className="App-intro">
            <Route path="/" exact component={ProjectTable} />
            <Route path="/config" exact component={ConfigForm} />
            <Route path="/add" exact component={AddProject} />
            <Route path="/p/:projectId" component={Project} />
          </p>
        </Router>
      </div>
    );
  }
}
export default App;
