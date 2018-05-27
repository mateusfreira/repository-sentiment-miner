import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import CommitMiner from '../../services/CommitMiner.js';
import Util from './Util.js';
import AbstractComponent from './AbstractComponent.jsx';
import { connect } from 'react-redux';
import { fetchComparativeData } from '../../redux/actions';
const { getPieChartData } = Util;

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
        /*
                              labels: {
                                  show: true
                              }*/
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
    return this.props.dispatch(fetchComparativeData());
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
          nredraw={true}
        />
        <div style={{ width: '33%', float: 'left' }}>
          <h2>Comments </h2>
          <Pie data={this.props.chartData} nredraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Reviews </h2>
          <Pie data={this.props.reviewChartData} nredraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Commits </h2>
          <Pie data={this.props.commitsChartData} nredraw={true} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = function(state) {
  const { project, general } = state.comparative || {
    project: {
      data: {
        comments: {},
        reviews: {},
        commits: {}
      }
    },
    general: {
      data: {
        comments: {},
        reviews: {},
        commits: {}
      }
    }
  };
  return {
    comparative: {
      data: getComparativeChart(project.data, general.data)
    },
    chartData: getPieChartData(project.data.reviews),
    commitsChartData: getPieChartData(project.data.commits),
    reviewChartData: getPieChartData(project.data.reviews)
  };
  Object.assign(
    this.state.comparative.data,
    getComparativeChart(project.data, general.data)
  );
  this.setState(this.state);
  this.setState({
    chartData: getPieChartData(project.data.comments),
    reviewChartData: getPieChartData(project.data.reviews),
    commitsChartData: getPieChartData(project.data.commits)
  });

  return {
    comparative: state.comparative
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparativeChart);
