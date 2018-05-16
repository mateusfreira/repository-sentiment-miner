import _ from 'lodash';
import React from 'react';
import Promise from 'bluebird';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2';
import CommitMiner from '../services/CommitMiner.js';
/* UI Components */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import GridCard from '../components/GridCard.jsx';
import Snackbar from 'material-ui/Snackbar';

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
function getComparativeChart(self, sentimentData, generalData) {
  const data = {
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
  self.state.comparative.data = data;
  return self.setState({
    comparative: self.state.comparative
  });
}
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
    this.projectName = props.match.params.projectId;
    this.state = {
      swb: {},
      worst: [],
      sentimentals: [],
      bests: [],
      onceContributors: {},
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
      },
      project: {
        commits: []
      },
      isSnackOpened: true,
      intervalId: null
    };

    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentDidMount() {
    const self = this;
    const updateProjectStatus = () => {
      Promise.props({
        project: this.service.getInteractionsReport(this.projectName),
        general: this.service.getInteractionsReport()
      }).then(({ project, general }) => {
        getComparativeChart(this, project.data, general.data);
        this.setState({
          chartData: getPieChartData(project.data.comments),
          reviewChartData: getPieChartData(project.data.reviews),
          commitsChartData: getPieChartData(project.data.commits)
        });
      });

      this.service.getWeekDayeReport(this.projectName).then(({ data }) => {
        this.setState({
          lineChartData: getLineChartData(data)
        });
      });

      this.service.getSwb(this.projectName).then(({ data }) => {
        this.setState({
          swb: getSWBChartData(data)
        });
      });

      this.service.getWrostAndBest(this.projectName).then(({ data }) => {
        this.setState({ worst: data.worst, bests: data.bests });
      });

      this.service.getProjectState(this.projectName).then(({ data }) => {
        this.setState({
          project: data
        });
      });

      this.service.getMostSentimental(this.projectName).then(({ data }) => {
        this.setState({
          sentimentals: data
        });
      });

      this.service.getOnceContributors(this.projectName).then(({ data }) => {
        this.setState({
          onceContributors: data
        });
      });
    };
    updateProjectStatus();
    this.setState({
      update: true
    });
  }
  componentWillUnmount() {
    this.setState({
      update: false
    });
  }
  handleRequestClose = () => {
    this.setState({
      isSnackOpened: false
    });
  };

  render() {
    return (
      <span>
        <h2>
          {' '}
          {this.state.project.full_name} ({this.state.project.language})
        </h2>
        <div style={{ width: '100%', float: 'left' }}>
          <h2> Comparative </h2>
          <Bar
            data={this.state.comparative.data}
            height={50}
            options={this.state.comparative.options}
            plugins={this.state.comparative.plugins}
            nredraw={true}
          />
        </div>
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
        <div>
          <span style={{ width: '49%', float: 'left' }}>
            <h2> Sentiment by weekday </h2>
            <Line height="50" data={this.state.lineChartData} />
          </span>
        </div>
        <div
          style={{
            'border-left': '1px solid gray',
            'border-top': '1px solid gray',
            width: '49%',
            float: 'left'
          }}
        >
          <h2> Contributors </h2>
          <Pie
            data={getPieChartData(
              [
                this.state.onceContributors.once,
                this.state.onceContributors.moreThanOnce
              ],
              ['Once', 'More than once'],
              ['gray', 'green']
            )}
            nredraw={true}
          />
        </div>
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
              {this.state.bests.map((comment, idx) => (
                <TableRow key={idx}>
                  <TableRowColumn>{comment.body}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <span style={{ width: '100%', float: 'left' }}>
            <h2> SWB in time </h2>
            <Line height="50" data={this.state.swb} />
          </span>
        </div>

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
                <TableHeaderColumn>
                  Most sentimental developers
                </TableHeaderColumn>
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
      </span>
    );
  }
}

export default ProjectPage;
