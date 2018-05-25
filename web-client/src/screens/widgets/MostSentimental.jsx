import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import CommitMiner from '../../services/CommitMiner.js';

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

class MostSentimental extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.state = {
      worst: [],
      best: []
    };
  }
  componentWillMount() {
    this.service.getWrostAndBest(this.props.project).then(({ data }) => {
      this.setState({ worst: data.worst, best: data.bests });
    });
  }

  render() {
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
              {this.state.worst.map((comment, idx) => (
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
              {this.state.best.map((comment, idx) => (
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

export default MostSentimental;
