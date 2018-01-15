import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';

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

let id = 0;
function createData(name, calories, fat, carbs, protein) {
      id += 1;
      return { id, name, calories, fat, carbs, protein };
}

const data = [
      createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
      createData('Eclair', 262, 16.0, 24, 6.0),
      createData('Cupcake', 305, 3, 67, 4.3),
      createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function BasicTable(props) {
      const { classes } = props;

      return (
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell numeric>total commits</TableCell>
                      <TableCell numeric>processed commits</TableCell>
                      <TableCell numeric>progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(n => {
                                    return (
                                                      <TableRow key={n.id}>
                                                        <TableCell><a href={'/p/'+n.id}>{n.name}</a></TableCell>
                                                        <TableCell numeric>{n.calories}</TableCell>
                                                        <TableCell numeric>{n.fat}</TableCell>
                                                        <TableCell numeric><LinearProgress mode="determinate" value={90} /></TableCell>
                                                      </TableRow>
                                                    );
                                  })}
                  </TableBody>
                </Table>
              </Paper>
            );
}

BasicTable.propTypes = {
      classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicTable);
