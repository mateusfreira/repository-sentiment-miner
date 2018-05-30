import _ from 'lodash';
import React from 'react';
import AbstractComponent from './AbstractComponent.jsx';
import { connect } from 'react-redux';
import { fetchMostSentimentalDevelopers } from '../../redux/actions';
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
  }
  loadData() {
    return this.props.dispatch(
      fetchMostSentimentalDevelopers(this.props.project)
    );
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
            {this.props.sentimentals.map((developer, idx) => (
              <TableRow key={idx}>
                <TableRowColumn style={{ width: '30%' }}>
                  <img src={developer.value.avatar_url} height="100" />
                  <br />
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
function mapStateToProps(state) {
  return {
    sentimentals: state.sentimentals || []
  };
}
export default connect(
  mapStateToProps,
  MostSentimentalDevelopers._mapDispatchToProps
)(MostSentimentalDevelopers);
