import React from 'react';
import { connect } from 'react-redux';

import ComparativeChart from './widgets/ComparativeChart';
import OnceContributors from './widgets/OnceContributors';
import SentimentByWeekday from './widgets/SentimentByWeekday';
import MostSentimental from './widgets/MostSentimental';
import MostSentimentalDevelopers from './widgets/MostSentimentalDevelopers';
import SubjectivWeellBeing from './widgets/SubjectivWeellBeing';
import { fetchProject } from '../redux/actions/index';

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

const mapStateToProps = ({ project }) => ({ project });

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
