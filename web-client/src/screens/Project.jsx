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
import SubjectivWeellBeing from './widgets/SubjectivWeellBeing.jsx';

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
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
    this.project = props.match.params.projectId;
    this.state = { project: {} };
  }

  componentWillMount() {
    const self = this;
    this.service.getProjectState(this.project).then(({ data }) => {
      this.setState({
        project: data
      });
    });
    this.setState({
      update: true
    });
  }
  componentWillUnmount() {
    this.setState({
      update: false
    });
  }

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
        <SubjectivWeellBeing project={this.props.match.params.projectId} />
        <MostSentimentalDevelopers
          project={this.props.match.params.projectId}
        />
      </span>
    );
  }
}

export default ProjectPage;
