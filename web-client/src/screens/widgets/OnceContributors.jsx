import Promise from 'bluebird';
import _ from 'lodash';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import CommitMiner from '../../services/CommitMiner.js';

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

class OnceContributors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onceContributors: {}
    };
    this.service = new CommitMiner(window.location.hostname);
  }
  componentDidMount() {
    this.service.getOnceContributors(this.props.project).then(({ data }) => {
      this.setState({
        onceContributors: data
      });
    });
  }
  render() {
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
              this.state.onceContributors.once,
              this.state.onceContributors.moreThanOnce
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

export default OnceContributors;
