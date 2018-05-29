import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import CommitMiner from '../../services/CommitMiner.js';
import AbstractComponent from './AbstractComponent.jsx';

import { connect } from 'react-redux';
import { fetchOnceContributors } from '../../redux/actions';

import Util from './Util.js';
const { getPieChartData } = Util;

class OnceContributors extends AbstractComponent {
  constructor(props) {
    super(props);
  }
  loadData() {
    return this.props.dispatch(fetchOnceContributors(this.props.project));
  }
  renderAfterLoad() {
    return (
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
              this.props.onceContributors.once,
              this.props.onceContributors.moreThanOnce
            ],
            ['Once', 'More than once'],
            ['gray', 'green']
          )}
          nredraw={true}
        />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  const onceContributors = state.onceContributors || {
    once: [],
    moreThanOnce: []
  };
  return {
    onceContributors
  };
};

export default connect(mapStateToProps, OnceContributors._mapDispatchToProps)(
  OnceContributors
);
