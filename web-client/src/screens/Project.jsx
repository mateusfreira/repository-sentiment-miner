import _ from 'lodash';
import React from 'react';
import Promise from 'bluebird';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2';
import CommitMiner from '../services/CommitMiner.js';
import ComparativeChart from './widgets/ComparativeChart.jsx';
import OnceContributors from './widgets/OnceContributors.jsx';
import SentimentByWeekday from './widgets/SentimentByWeekday.jsx';
import MostSentimental from './widgets/MostSentimental.jsx';
import MostSentimentalDevelopers from './widgets/MostSentimentalDevelopers.jsx';
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
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
    this.projectName = props.match.params.projectId;
    this.state = {
      swb: {},
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
      this.service.getSwb(this.projectName).then(({ data }) => {
        this.setState({
          swb: getSWBChartData(data)
        });
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
        <ComparativeChart project={this.props.match.params.projectId} />
        <SentimentByWeekday project={this.props.match.params.projectId} />
        <OnceContributors project={this.props.match.params.projectId} />
        <MostSentimental project={this.props.match.params.projectId} />
        <div>
          <span style={{ width: '100%', float: 'left' }}>
            <h2> SWB in time </h2>
            <Line height="50" data={this.state.swb} />
          </span>
        </div>

        <MostSentimentalDevelopers
          project={this.props.match.params.projectId}
        />
      </span>
    );
  }
}

export default ProjectPage;
