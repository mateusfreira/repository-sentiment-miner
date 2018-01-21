import React from 'react';
import PropTypes from 'prop-types';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';
import Paper from 'material-ui/Paper';

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.projectName = props.match.params.projectId;
    this.state = {
      project: { commits: [] }
    };
  }
  componentDidMount() {
    setInterval(() => {
      axios
        .get(`http://localhost:8080/project/${this.projectName}`)
        .then(res => {
          const project = res.data;
          if (project.commits)
            this.setState({
              project
            });
        });
    }, 1000);
  }
  render() {
    return (
      <Paper style={style.root}>
        <Table style={style.table}>
          <TableHead>
            <TableRow>
              <TableCell>Commit</TableCell>
              <TableCell numeric>Elapsed time</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.project.commits.map(n => {
              return (
                <TableRow>
                  <TableCell>{n.commit}</TableCell>
                  <TableCell>
                    {(
                      ((n._end
                        ? new Date(n._end).getTime()
                        : n._start ? new Date() : 0) -
                        (n._start ? new Date(n._start).getTime() : 0)) /
                      1000
                    ).toFixed(2)}s
                  </TableCell>
                  <TableCell>
                    {(n._pending || n._pending === undefined) &&
                    !n._processing ? (
                      <span>Pending</span>
                    ) : (
                      <span />
                    )}
                    {n._processing ? (
                      <CircularProgress className={10} color="accent" />
                    ) : (
                      <span />
                    )}
                    {n._processed ? <span> Ok</span> : <span />}
                    {n._error ? (
                      <span> Error: {n._errorMessage} </span>
                    ) : (
                      <span />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

const style = {
  root: {
    width: '100%',
    marginTop: '20px',
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
};

ProjectPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default ProjectPage;
