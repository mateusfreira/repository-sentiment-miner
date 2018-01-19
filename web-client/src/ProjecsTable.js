import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import _ from 'lodash';
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});
class ProjectTable extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      projects: []
    };
  }
  componentDidMount() {
    axios.get(`http://localhost:8080/list`).then(res => {
      const projects = res.data;
      projects.forEach(_.partial(updateProjectState, _, projects, this));
      this.setState({
        projects
      });
    });
  }
  render() {
    return (
      <Paper className={this.classes.root}>
        <Table className={this.classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell numeric>total commits</TableCell>
              <TableCell numeric>processed commits</TableCell>
              <TableCell numeric>progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.projects.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>
                    <a href={'/p/' + n.name}>{n.name}</a>
                  </TableCell>
                  <TableCell numeric>{n.commitsCount}</TableCell>
                  <TableCell numeric>{n.processedCount}</TableCell>
                  <TableCell numeric>
                    <LinearProgress mode="determinate" value={n.percent || 0} />
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
function updateProjectState(project, projects, component) {
  axios
    .get(`http:\/\/localhost:8080\/project\/status\/${project.name}`)
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
ProjectTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectTable);
