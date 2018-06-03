import React, { Component } from 'react';
import swal from 'sweetalert2';
import styled from 'styled-components';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import shortid from 'shortid';
import container from '../components/Container';
import CommitMiner from '../services/CommitMiner';

class ConfigForm extends Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
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
    this.service
      .getConfiguration()
      .then(({ data }) => {
        this.setState({
          ...data
        });
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
    this.service
      .updateConfig(config)
      .then(() => {
        swal('Saved!', 'Your configuration has been updated.', 'success');
      })
      .catch(() => {
        swal('Ops...', 'Check if commits miner is running correctly.', 'error');
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
    return inputs.map(input => (
      <span key={shortid.generate()}>
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
