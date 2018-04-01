import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
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

function getPieChartData(data) {
  return {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [data.positive, data.neutral, data.negative],
        backgroundColor: ['green', 'gray', 'red'],
        hoverBackgroundColor: ['green', 'gray', 'red']
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
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
    this.projectName = props.match.params.projectId;
    this.state = {
      worst: [],
      bests: [],
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
      this.service.getInteractionsReport(this.projectName).then(({ data }) => {
        this.setState({
          chartData: getPieChartData(data.comments),
          reviewChartData: getPieChartData(data.reviews),
          commitsChartData: getPieChartData(data.commits)
        });
      });

      this.service.getWeekDayeReport(this.projectName).then(({ data }) => {
        this.setState({
          lineChartData: getLineChartData(data)
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
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Comments </h2>
          <Pie data={this.state.chartData} redraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2>Reviews</h2>
          <Pie data={this.state.reviewChartData} redraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h2> Commits </h2>
          <Pie data={this.state.commitsChartData} redraw={true} />
        </div>
        <div>
          <span style={{ width: '33%', float: 'left' }}>
            <h2> Sentiment by weekday </h2>
            <Line data={this.state.lineChartData} />
          </span>
        </div>
        <div style={{ border: '1px solid gray', width: '33%', float: 'left' }}>
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
        <div style={{ border: '1px solid gray', width: '33%', float: 'left' }}>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Most negative comments</TableHeaderColumn>
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
      </span>
    );
  }
}

export default ProjectPage;
