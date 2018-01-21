import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import _ from 'lodash';
import swal from 'sweetalert2';

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      projects: []
    };
  }
  componentDidMount() {
    axios
      .get(`http://localhost:8080/list`)
      .then(res => {
        const projects = res.data;
        projects.forEach(_.partial(updateProjectState, _, projects, this));
        this.setState({ projects });
      })
      .catch(err => {
        swal(
          'Ops...',
          `${err.message}. Check if commits miner is running correctly.`,
          'error'
        );
      });
  }
  render() {
    return (
      <Paper style={style.root}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Project</TableHeaderColumn>
              <TableHeaderColumn>total commits</TableHeaderColumn>
              <TableHeaderColumn>processed commits</TableHeaderColumn>
              <TableHeaderColumn>progress</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.projects.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableRowColumn>
                    <a href={'/p/' + n.name}>{n.name}</a>
                  </TableRowColumn>
                  <TableRowColumn numeric>{n.commitsCount}</TableRowColumn>
                  <TableRowColumn numeric>{n.processedCount}</TableRowColumn>
                  <TableRowColumn numeric>
                    <CircularProgress
                      mode="determinate"
                      value={n.percent || 0}
                    />
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

function updateProjectState(project, projects, component) {
  axios
    .get(`http://localhost:8080/project/status/${project.name}`)
    .then(r => Object.assign(project, r.data))
    .then(() =>
      component.setState({
        projects
      })
    )
    .then(() => {
      setTimeout(
        updateProjectState.bind(null, project, projects, component),
        3000
      );
    });
}

const style = {
  root: {
    width: '100%',
    marginTop: '20px',
    overflowX: 'auto'
  }
};

export default ProjectTable;
