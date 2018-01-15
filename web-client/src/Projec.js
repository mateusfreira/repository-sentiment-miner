import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { CircularProgress } from 'material-ui/Progress';

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
function createData(name, status) {
      id += 1;
      return { id, name, status  };
}

const data = [
      createData('51064491230da2775301d7e8d1fa1ccbb7314a2b', 'done'),
      createData('51064491230da2775301d7e8d1fa1ccbb7314a21', 'processing'),
      createData('51064491230da2775301d7e8d1fa1ccbb7314a123', 'waiting'),
      createData('51064491230da2775301d7e8d1fa1ccbb73112322', 'waiting'),
      createData('51064491230da2775301d7e8d1fa1ccbb7314123', 'waiting'),
];

function BasicTable(props) {
      const { classes } = props;

      return (
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Commit</TableCell>
                      <TableCell numeric>progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(n => {
                                    return (
                                                      <TableRow key={n.id}>
                                                        <TableCell><a href={'/p/'+n.id}>{n.name}</a></TableCell>
                                                        <TableCell>
                                                            { 
                                                             n.status !== 'processing' ? <span>{n.status}</span> : <CircularProgress className={10} color="accent" /> 
                                                            }
                                                        </TableCell>
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
