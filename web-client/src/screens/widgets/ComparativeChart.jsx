import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import Util from './Util';
import AbstractComponent from './AbstractComponent';
import { fetchComparativeData } from '../../redux/actions';

const { getPieChartData } = Util;

const emptyState = {
  comments: {},
  reviews: {},
  commits: {}
};

const emptyComparative = {
  project: {
    data: emptyState
  },
  general: {
    data: emptyState
  }
};
function getComparativeChart(sentimentData, generalData) {
  return {
    labels: ['Comments', 'Reviews', 'Commits'],
    datasets: [
      {
        label: 'Negative Mean',
        type: 'line',
        data: [
          generalData.comments.negative,
          generalData.reviews.negative,
          generalData.commits.negative
        ],
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-2'
      },
      {
        label: 'Positive Mean',
        type: 'line',
        data: [
          generalData.comments.positive,
          generalData.reviews.positive,
          generalData.commits.positive
        ],
        fill: false,
        borderColor: '#006400',
        backgroundColor: '#006400',
        pointBorderColor: '#006400',
        pointBackgroundColor: '#006400',
        pointHoverBackgroundColor: '#006400',
        pointHoverBorderColor: '#006400',
        yAxisID: 'y-axis-2'
      },

      {
        type: 'bar',
        label: 'Positive',
        data: [
          sentimentData.comments.positive,
          sentimentData.reviews.positive,
          sentimentData.commits.positive
        ],
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1'
      },
      {
        type: 'bar',
        label: 'Negative',
        data: [
          sentimentData.comments.negative,
          sentimentData.reviews.negative,
          sentimentData.commits.negative
        ],
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        hoverBackgroundColor: 'red',
        hoverBorderColor: 'red',
        yAxisID: 'y-axis-1'
      }
    ]
  };
}
const COMPARATIVE_CHART_OPTIONS = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        }
      }
    ]
  }
};
class ComparativeChart extends AbstractComponent {
  constructor(props) {
    super(props);
    this.comparativeOptions = COMPARATIVE_CHART_OPTIONS;
  }

  loadData() {
    return this.props.dispatch(fetchComparativeData(this.props.project));
  }
  renderAfterLoad() {
    return (
      <div
        style={{
          width: '100%',
          float: 'left'
        }}
      >
        <h2> Comparative </h2>{' '}
        <Bar
          data={this.props.comparative.data}
          height={50}
          options={this.comparativeOptions}
          nredraw
        />
        <div style={{ width: '33%', float: 'left' }}>
          <h2>Comments </h2>
          <Pie data={this.props.chartData} nredraw />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Reviews </h2>
          <Pie data={this.props.reviewChartData} nredraw />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Commits </h2>
          <Pie data={this.props.commitsChartData} nredraw />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { project, general } = state.comparative || emptyComparative;
  return {
    comparative: {
      data: getComparativeChart(project.data, general.data)
    },
    chartData: getPieChartData(project.data.reviews),
    commitsChartData: getPieChartData(project.data.commits),
    reviewChartData: getPieChartData(project.data.reviews)
  };
};

export default connect(mapStateToProps, ComparativeChart._mapDispatchToProps)(
  ComparativeChart
);
