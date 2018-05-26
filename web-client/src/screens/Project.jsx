import _ from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RECEIVE_PROJECTS } from '../redux/actions';

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
const mapStateToProps = function(state) {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      RECEIVE_PROJECTS
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
