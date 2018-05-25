import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import CommitMiner from '../../services/CommitMiner.js';
import { Line } from 'react-chartjs-2';

function getSWBChartData(data) {
  return {
    labels: ['2 hours', '4 hours', '8 hours', '16 hours'],
    datasets: [
      {
        label: 'General',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'blue',
        borderColor: 'blue',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'blue',
        pointHoverBorderColor: 'blue',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.keys(data)
          .map(key => data[key].general.percent)
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
        pointBackgroundColor: 'green',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'green',
        pointHoverBorderColor: 'green',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.keys(data)
          .map(key => data[key].positive.percent)
          .map(a => parseFloat((a * 100).toFixed(2)))
      },
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
        data: Object.keys(data)
          .map(key => data[key].negative.percent)
          .map(a => parseFloat((a * 100).toFixed(2)))
      }
    ]
  };
}

class SubjectivWeellBeing extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.state = {
      worst: [],
      best: []
    };
  }
  componentWillMount() {
    this.service.getSwb(this.props.project).then(({ data }) => {
      this.setState({ swb: getSWBChartData(data) });
    });
  }

  render() {
    return (
      <div>
        <span style={{ width: '100%', float: 'left' }}>
          <h2> SWB in time </h2>
          <Line height="50" data={this.state.swb} />
        </span>
      </div>
    );
  }
}

export default SubjectivWeellBeing;
