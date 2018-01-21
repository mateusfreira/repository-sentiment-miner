import React from 'react';
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
  handleInputChange(name, value) {
    this.setState({ [name]: value });
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
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={this.state.url}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddProject;
