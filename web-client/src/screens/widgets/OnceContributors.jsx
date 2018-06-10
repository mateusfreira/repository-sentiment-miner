import React from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import AbstractComponent from './AbstractComponent';

import { fetchOnceContributors } from '../../redux/actions';

import Util from './Util';

const { getPieChartData } = Util;

class OnceContributors extends AbstractComponent {
  loadData() {
    return this.props.dispatch(fetchOnceContributors(this.props.project));
  }
  renderAfterLoad() {
    return (
      <div
        style={{
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
          nredraw
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
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
