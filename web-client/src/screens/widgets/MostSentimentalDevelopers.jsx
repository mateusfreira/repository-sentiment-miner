import _ from 'lodash';
import React from 'react';
import AbstractComponent from './AbstractComponent.jsx';

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

import Util from './Util.js';
const { getPieChartData } = Util;

class MostSentimentalDevelopers extends AbstractComponent {
  constructor(props) {
    super(props);
    this.state = {
      sentimentals: []
    };
  }
  loadData() {
    return this.service
      .getMostSentimental(this.props.project)
      .then(({ data }) => {
        this.setState({
          sentimentals: data
        });
      });
  }

  renderAfterLoad() {
    return (
      <div
        style={{
          'border-rigth': '1px solid gray',
          width: '49%',
          float: 'left'
        }}
      >
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Most sentimental developers</TableHeaderColumn>
              <TableHeaderColumn>Sentiment distribution</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.state.sentimentals.map((developer, idx) => (
              <TableRow key={idx}>
                <TableRowColumn style={{ width: '30%' }}>
                  {developer.value.login}
                </TableRowColumn>
                <TableRowColumn>
                  <Pie
                    data={getPieChartData({
                      positive:
                        developer.contribuitions.comments.sentiment.geral
                          .positive || 0,
                      neutral:
                        developer.contribuitions.comments.sentiment.geral
                          .neutral || 0,
                      negative:
                        developer.contribuitions.comments.sentiment.geral
                          .negative || 0
                    })}
                    nredraw={true}
                  />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default MostSentimentalDevelopers;
