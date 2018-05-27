import React, { Component } from 'react';
import _ from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RECEIVE_PROJECTS } from '../redux/actions';

import swal from 'sweetalert2';
import styled from 'styled-components';
import CommitMiner from '../services/CommitMiner.js';
/* UI Components */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import GridCard from '../components/GridCard.jsx';

function updateProjectState(project, projects, component) {
  component.service
    .getProjectStatus(project)
    .then(({ data }) => Object.assign(project, data))
    .then(() =>
      component.setState({
        projects
      })
    );
}
const mapStateToProps = function(state) {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      RECEIVE_PROJECTS
    },
    dispatch
  );
};

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'here ');
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
  }
  /*
  componentDidMount() {
    this.service
      .getProjectList()
      .then(({ data }) => {
        this.setState({
          projects: data
        });
      })
      .catch(err => {
        swal(
          'Ops...',
          `${err.message}. Check if commits miner is running correctly.`,
          'error'
        );
      });
  }*/

  loadProject(rowNum) {
    const name = this.props.projects[rowNum]._id;
    this.props.history.push(`/project/${name}`);
  }
  changePage(name) {
    this.props.history.push(`/${name}`);
  }
  handleEmptyProjects() {
    return (
      <EmptyMessage>
        <i>No projects to show</i>
        <StyledButton
          label="Click here to add"
          onClick={() => this.changePage('add')}
          labelPosition="before"
          icon={<AddIcon />}
          fullWidth
        />
      </EmptyMessage>
    );
  }
  render() {
    const projects = this.props.projects;
    return (
      <GridCard>
        {projects && projects.length ? (
          <Table onCellClick={rowNum => this.loadProject(rowNum)}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Project</TableHeaderColumn>
                <TableHeaderColumn>Stargazers</TableHeaderColumn>
                <TableHeaderColumn>Forks</TableHeaderColumn>
                <TableHeaderColumn>Progress</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {projects.map((project, idx) => (
                <ClickableRow key={`p${idx}`}>
                  <TableRowColumn>{project.name}</TableRowColumn>
                  <TableRowColumn>{project.stargazers_count}</TableRowColumn>
                  <TableRowColumn>{project.forks_count}</TableRowColumn>
                  <TableRowColumn>
                    {project.percent === 100 ? (
                      <i>Finished</i>
                    ) : (
                      <CircularProgress />
                    )}
                  </TableRowColumn>
                </ClickableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          this.handleEmptyProjects()
        )}
      </GridCard>
    );
  }
}

const ClickableRow = styled(TableRow)`
  cursor: pointer;
`;

const EmptyMessage = styled.div`
  padding: 24px;
`;

const StyledButton = styled(FlatButton)`
  margin-top: 12px !important;
`;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTable);
