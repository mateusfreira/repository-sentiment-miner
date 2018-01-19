import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import axios from 'axios';

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.state[name] = value;
    this.setState(this.state);
  }
  handleSubmit(event) {
    axios
      .post(`http://localhost:8080/start`, { url: this.state.url })
      .then(res => {
        alert('Started!');
      })
      .catch(() => alert('Error!'));
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Git URL:
          <input
            type="text"
            name="url"
            onChange={this.handleInputChange}
            value={this.state.url}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddProject;
