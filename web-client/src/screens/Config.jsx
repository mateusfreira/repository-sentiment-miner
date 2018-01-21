import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';

class ConfigForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultPath: '/tmp',
      nProcesses: 3,
      tasks: '../tasks/ls.js',
      outputer: '../output/jsonFile.js'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    axios
      .get(`http://localhost:8080/config`)
      .then(({ data }) => {
        console.log(...data);
        this.setState({ ...data });
      })
      .catch(err => {
        swal(
          'Ops...',
          `${err.message}. Check if commits miner is running correctly.`,
          'error'
        );
      });
  }
  handleInputChange(name, value) {
    this.setState({ [name]: value });
  }
  handleSubmit(event) {
    const config = { ...this.state };
    axios
      .post(`http://localhost:8080/config`, config)
      .then(res => {
        alert('Saved!');
      })
      .catch(() => alert('Error!'));
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Result Path:
          <input
            type="text"
            name="resultPath"
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={this.state.resultPath}
          />
        </label>
        <label>
          Tasks:
          <input
            type="text"
            name="tasks"
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={this.state.tasks}
          />
        </label>
        <label>
          Outputer:
          <input
            type="text"
            name="outputer"
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={this.state.outputer}
          />
        </label>
        <label>
          Number of Porcesses
          <input
            type="text"
            name="nProcesses"
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={this.state.nProcesses}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ConfigForm;
