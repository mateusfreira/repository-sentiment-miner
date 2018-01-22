import React from 'react';
import axios from 'axios';

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
import GridCard from '../components/GridCard.jsx';
import Snackbar from 'material-ui/Snackbar';

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.projectName = props.match.params.projectId;
    this.state = {
      project: { commits: [] },
      isSnackOpened: true,
      intervalId: null
    };

    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  componentDidMount() {
    const intervalId = setInterval(() => {
      axios
        .get(`http://localhost:8080/project/${this.projectName}`)
        .then(({ data }) => {
          const project = data;
          if (project.commits) this.setState({ project });
        });
    }, 1000);
    console.log('Setting new interval: ', intervalId);
    this.setState({ intervalId });
  }
  componentWillUnmount() {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
  handleRequestClose = () => {
    this.setState({ isSnackOpened: false });
  };
  geElapsedTime(commit) {
    return `${(
      ((commit._end
        ? new Date(commit._end).getTime()
        : commit._start ? new Date() : 0) -
        (commit._start ? new Date(commit._start).getTime() : 0)) /
      1000
    ).toFixed(2)}s`;
  }
  render() {
    return (
      <GridCard>
        <Snackbar
          open={this.state.isSnackOpened}
          message={`Project: ${this.projectName}`}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Commit</TableHeaderColumn>
              <TableHeaderColumn>Elapsed time</TableHeaderColumn>
              <TableHeaderColumn>Progress</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.project.commits.map(commit => (
              <TableRow key={commit.commit}>
                <TableRowColumn>{commit.commit}</TableRowColumn>
                <TableRowColumn>{this.geElapsedTime(commit)}</TableRowColumn>
                <TableRowColumn>
                  {(commit._pending || commit._pending === undefined) &&
                  !commit._processing ? (
                    <span>Pending</span>
                  ) : (
                    <span />
                  )}
                  {commit._processing ? (
                    <CircularProgress className={10} color="accent" />
                  ) : (
                    <span />
                  )}
                  {commit._processed ? <span> Ok</span> : <span />}
                  {commit._error ? (
                    <span> Error: {commit._errorMessage} </span>
                  ) : (
                    <span />
                  )}
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GridCard>
    );
  }
}

export default ProjectPage;
