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
          .map(i => i.count)
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
          .map(i => i.count)
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
      project: { commits: [] },
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
    this.setState({ isSnackOpened: false });
  };

  render() {
    return (
      <span>
        <div style={{ width: '33%', float: 'left' }}>
          <h1> Comments</h1>
          <Pie data={this.state.chartData} redraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h1> Reviews</h1>
          <Pie data={this.state.reviewChartData} redraw={true} />
        </div>
        <div style={{ width: '33%', float: 'left' }}>
          <h1> Commits</h1>
          <Pie data={this.state.commitsChartData} redraw={true} />
        </div>
        <div>
          <h1>Sentiment by weekday</h1>
          <Line data={this.state.lineChartData} />
        </div>
      </span>
    );
  }
}

export default ProjectPage;
