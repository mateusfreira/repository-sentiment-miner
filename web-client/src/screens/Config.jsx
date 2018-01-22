import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import styled from 'styled-components';
import container from '../components/Container.jsx';

/* UI Components */
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
    event.preventDefault();
    const config = { ...this.state };
    axios
      .post(`http://localhost:8080/config`, config)
      .then(res => {
        swal('Saved!', 'Your configuration has been updated.', 'success');
      })
      .catch(err => {
        swal('Ops...', `Check if commits miner is running correctly.`, 'error');
      });
  }
  renderInputs() {
    const inputs = [
      {
        label: 'Result Path',
        name: 'resultPath'
      },
      {
        label: 'Tasks',
        name: 'tasks'
      },
      {
        label: 'Outputer',
        name: 'outputer'
      },
      {
        label: 'Number of Porcesses',
        name: 'nProcesses'
      }
    ];
    return inputs.map((input, idx) => (
      <span key={`configInput_${idx}`}>
        <TextField
          floatingLabelText={input.label}
          name={input.name}
          onChange={e => this.handleInputChange(e.target.name, e.target.value)}
          value={this.state[input.name]}
          fullWidth
        />
        <br />
      </span>
    ));
  }
  render() {
    return (
      <Card>
        <CardTitle
          title="Configuration"
          subtitle="Set the properties above to configure your project"
        />
        <CardText>
          <form onSubmit={this.handleSubmit}>
            <InputsContainer>{this.renderInputs()}</InputsContainer>
            <Button
              label="Save"
              type="submit"
              onClick={() => this.handleSubmit}
              fullWidth
            />
          </form>
        </CardText>
      </Card>
    );
  }
}

const InputsContainer = styled.div`
  margin: auto;
  max-width: 80%;
`;

const Button = styled(RaisedButton)`
  margin-top: 14px;
`;

export default container(ConfigForm);
