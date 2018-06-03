import React from 'react';
import swal from 'sweetalert2';
import styled from 'styled-components';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import container from '../components/Container';
import CommitMiner from '../services/CommitMiner';

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.state = {
      url: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(name, value) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    this.service
      .startProject(this.state.url)
      .then(() => {
        swal('Saved!', 'Your project has been added.', 'success');
      })
      .catch(err => {
        swal(
          'Ops...',
          `${err.message}. Check if commits miner is running correctly.`,
          'error'
        );
      });
    event.preventDefault();
  }
  render() {
    return (
      <Card>
        <CardTitle
          title="Add project"
          subtitle="Remember to use SSH or HTTPS"
        />
        <CardText>
          <form onSubmit={this.handleSubmit}>
            <TextField
              floatingLabelText="Insert your URL here"
              name="url"
              onChange={e =>
                this.handleInputChange(e.target.name, e.target.value)
              }
              value={this.state.url}
              fullWidth
            />
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

const Button = styled(RaisedButton)`
  margin-top: 14px;
`;

export default container(AddProject);
