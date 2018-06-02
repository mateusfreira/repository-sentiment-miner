import React from 'react';
import _ from 'lodash';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import AbstractComponent from './AbstractComponent';

import { fetchWeekSentimentData } from '../../redux/actions';

function getLineChartData(data) {
  const totals = _.chain(data)
    .values()
    .flatten()
    .groupBy('_id')
    .mapValues(d => d.reduce((c, a) => a.count + c, 0))
    .value();
  return {
    labels: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    datasets: [
      {
        label: 'Negative comments',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'red',
        borderColor: 'red',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'red',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: _.sortBy(data.negative, '_id')
          .map(i => i.count / totals[i._id])
          .map(a => parseFloat((a * 100).toFixed(2)))
      },
      {
        label: 'Positive comments',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'green',
        borderColor: 'green',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'green',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'green',
        pointHoverBorderColor: 'green',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: _.sortBy(data.positive, '_id')
          .map(i => i.count / totals[i._id])
          .map(a => parseFloat((a * 100).toFixed(2)))
      },
      {
        label: 'Neutral comments',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'gray',
        borderColor: 'gray',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'gray',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'gray',
        pointHoverBorderColor: 'gray',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: _.sortBy(data.neutral, '_id')
          .map(i => i.count / totals[i._id])
          .map(a => parseFloat((a * 100).toFixed(2)))
      }
    ]
  };
}

class SentimentByWeekday extends AbstractComponent {
  loadData() {
    return this.props.dispatch(fetchWeekSentimentData(this.props.project));
  }

  renderAfterLoad() {
    return (
      <div>
        <span style={{ width: '49%', float: 'left' }}>
          <h2> Sentiment by weekday </h2>
          <Line height="50" data={this.props.weekSentiment} />
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const weekSentiment = state.weekSentiment || { negative: [], positive: [] };
  return {
    weekSentiment: getLineChartData(weekSentiment)
  };
};

export default connect(mapStateToProps, SentimentByWeekday._mapDispatchToProps)(
  SentimentByWeekday
);
