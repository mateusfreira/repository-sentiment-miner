import React from 'react';
import CommitMiner from '../../services/CommitMiner.js';

import CircularProgress from 'material-ui/CircularProgress';

class AbstractComponent extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.state = {};
  }

  loadData() {
    return Promise.reject(`Not implemented`);
  }
  componentWillMount() {
    this.loadData().then(() =>
      this.setState({
        loaded: true
      })
    );
  }

  render() {
    return this.state.loaded ? this.renderAfterLoad() : <CircularProgress />;
  }
  static _mapDispatchToProps(dispatch) {
    return {
      dispatch
    };
  }
}
export default AbstractComponent;
