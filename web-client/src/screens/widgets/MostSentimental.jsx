import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import CommitMiner from '../../services/CommitMiner.js';
import AbstractComponent from './AbstractComponent.jsx';
import { connect } from 'react-redux';
import { fetchMostSentimental } from '../../redux/actions';
/* UI Components */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { Bar, Pie } from 'react-chartjs-2';

class MostSentimental extends AbstractComponent {
  constructor(props) {
    super(props);
  }
  loadData() {
    return this.props.dispatch(fetchMostSentimental(this.props.project));
  }

  renderAfterLoad() {
    return (
      <span>
        <div
          style={{
            'border-rigth': '1px solid gray',
            'border-bottom': '1px solid gray',
            width: '49%',
            float: 'left'
          }}
        >
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Most negative comments</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {this.props.worst.map((comment, idx) => (
                <TableRow key={idx}>
                  <TableRowColumn>{comment.body}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div
          style={{
            'border-left': '1px solid gray',
            'border-bottom': '1px solid gray',
            width: '49%',
            float: 'left'
          }}
        >
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Most positive comments</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {this.props.best.map((comment, idx) => (
                <TableRow key={idx}>
                  <TableRowColumn>{comment.body}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </span>
    );
  }
}
function mapStateToProps(state) {
  const mostSentimental = state.mostSentimental || {};
  return {
    best: mostSentimental.bests || [],
    worst: mostSentimental.worst || []
  };
}
export default connect(mapStateToProps, MostSentimental._mapDispatchToProps)(
  MostSentimental
);
