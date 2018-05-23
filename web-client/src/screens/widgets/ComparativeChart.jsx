import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import CommitMiner from '../../services/CommitMiner.js';

function getPieChartData(
  data,
  labels = ['Positive', 'Neutral', 'Negative'],
  backgroundColor = ['green', 'gray', 'red']
) {
  return {
    labels,
    datasets: [
      {
        data: !_.isArray(data)
          ? [data.positive, data.neutral, data.negative]
          : data,
        backgroundColor,
        hoverBackgroundColor: backgroundColor
      }
    ]
  };
}

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

class ComparativeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comparative: {
        data: [],
        options: {
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
                /*
                                          labels: {
                                              show: true
                                          }*/
              },
              {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                gridLines: {
                  display: false
                }
                /*
                                          labels: {
                                              show: true
                                          }*/
              }
            ]
          }
        },
        plugins: {}
      }
    };
    this.service = new CommitMiner(window.location.hostname);
  }
  componentDidMount() {
    Promise.props({
      project: this.service.getInteractionsReport(this.props.project),
      general: this.service.getInteractionsReport()
    }).then(({ project, general }) => {
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
    });
  }
  render() {
    return (
      <div style={{ width: '100%', float: 'left' }}>
        <h2> Comparative </h2>
        <Bar
          data={this.state.comparative.data}
          height={50}
          options={this.state.comparative.options}
          plugins={this.state.comparative.plugins}
          nredraw={true}
        />
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Comments </h2>
          <Pie data={this.state.chartData} nredraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2>Reviews</h2>
          <Pie data={this.state.reviewChartData} nredraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Commits </h2>
          <Pie data={this.state.commitsChartData} nredraw={true} />
        </div>
      </div>
    );
  }
}

export default ComparativeChart;
