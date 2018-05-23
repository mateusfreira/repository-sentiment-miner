import _ from 'lodash';
import React from 'react';
import Promise from 'bluebird';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2';
import CommitMiner from '../services/CommitMiner.js';
import ComparativeChart from './widgets/ComparativeChart.jsx';
import SentimentByWeekday from './widgets/SentimentByWeekday.jsx';
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
        <ComparativeChart project={this.props.match.params.projectId} />
        <SentimentByWeekday project={this.props.match.params.projectId} />
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
