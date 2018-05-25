import _ from 'lodash';
import React from 'react';

import CommitMiner from '../services/CommitMiner.js';
import ComparativeChart from './widgets/ComparativeChart.jsx';
import OnceContributors from './widgets/OnceContributors.jsx';
import SentimentByWeekday from './widgets/SentimentByWeekday.jsx';
import MostSentimental from './widgets/MostSentimental.jsx';
import MostSentimentalDevelopers from './widgets/MostSentimentalDevelopers.jsx';
import SubjectivWeellBeing from './widgets/SubjectivWeellBeing.jsx';

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
