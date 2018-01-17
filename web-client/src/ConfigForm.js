import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import axios from 'axios';

class ConfigForm extends React.Component {
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
          axios.get(`http://localhost:8080/config`)
              .then(res => {
                  const config = res.data;
                  this.setState({
                      config
                  });
              });
      }
      handleInputChange(event) {
          const target = event.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.state.config[name] = value;
          this.setState({
              config: this.state.config
          });
      }
      handleSubmit(event) {
          axios.post(`http://localhost:8080/config`, this.state.config)
              .then(res => {
                  alert('Saved!');
              }).catch(() => alert('Error!'));
          event.preventDefault();
      }
      render() {
              return (
                        <form onSubmit={this.handleSubmit}>
                          <label>
                            Result Path:
                            <input type="text" name="resultPath" onChange={this.handleInputChange} value={this.state.config.resultPath} />
                          </label>
                          <label>
                            Tasks:
                            <input type="text" name="tasks"  onChange={this.handleInputChange} value={this.state.config.tasks} />
                          </label>
                         <label>
                            Outputer:
                            <input type="text" name="outputer"  onChange={this.handleInputChange} value={this.state.config.outputer} />
                          </label>
                           <label>
                            Number of Porcesses:
                            <input type="text" name="nProcesses"  onChange={this.handleInputChange} value={this.state.config.nProcesses} />
                          </label>
                          <input type="submit" value="Submit" />
                        </form>
                      );
            }
}

export default ConfigForm;
