import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';

class ConfigForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        resultPath: '/tmp',
        nProcesses: 3,
        tasks: '../tasks/ls.js',
        outputer: '../output/jsonFile.js'
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    axios
      .get(`http://localhost:8080/config`)
      .then(res => {
        const config = res.data;
        this.setState({ config });
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
    const config = Object.assign({}, this.state.config);
    config[name] = value;
    this.setState({ config });
  }
  handleSubmit(event) {
    axios
      .post(`http://localhost:8080/config`, this.state.config)
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
            value={this.state.config.resultPath}
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
            value={this.state.config.tasks}
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
            value={this.state.config.outputer}
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
            value={this.state.config.nProcesses}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ConfigForm;
