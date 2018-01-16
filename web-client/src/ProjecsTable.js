import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import axios from 'axios';

const styles = theme => ({
      root: {
              width: '100%',
              marginTop: theme.spacing.unit * 3,
              overflowX: 'auto',
            },
      table: {
              minWidth: 700,
            },
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
        axios.get(`http://localhost:8080/list`)
            .then(res => {
                const projects = res.data;
                projects.map(p => axios.get(`http:\/\/localhost:8080\/project\/status\/${p.name}`).then((r) => Object.assign(p, r.data)).then(() =>
                    this.setState({
                        projects
                    })
                ))
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
                                                        <TableCell><a href={'/p/'+n.name}>{n.name}</a></TableCell>
                                                        <TableCell numeric>{n.commitsCount}</TableCell>
                                                        <TableCell numeric>{n.processedCount}</TableCell>
                                                        <TableCell numeric><LinearProgress mode="determinate" value={n.percent} /></TableCell>
                                                      </TableRow>
                                                    );
                                  })}
                  </TableBody>
                </Table>
              </Paper>
            );
     }
}

ProjectTable.propTypes = {
      classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectTable);
