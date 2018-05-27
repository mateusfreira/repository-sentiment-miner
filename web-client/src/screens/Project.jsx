import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
import { fetchProject } from '../redux/actions/index.js';
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  componentWillMount() {
    this.props.dispatch(fetchProject(this.props.match.params.projectId));
  }
  render() {
    return (
      <span>
        <h2>
          {' '}
          {this.props.project.full_name} ({this.props.project.language})
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

ProjectPage.defaultProps = {
  project: {}
};
const mapStateToProps = function(state) {
  return {
    project: state.project
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
