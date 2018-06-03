import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import shortid from 'shortid';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import { RECEIVE_PROJECTS } from '../redux/actions';
import CommitMiner from '../services/CommitMiner';
import GridCard from '../components/GridCard';

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    this.service = new CommitMiner(window.location.hostname);
    this.classes = props.classes;
  }
  /*
  componentDidMount() {
    this.service
      .getProjectList()
      .then(({ data }) => {
        this.setState({
          projects: data
        });
      })
      .catch(err => {
        swal(
          'Ops...',
          `${err.message}. Check if commits miner is running correctly.`,
          'error'
        );
      });
  } */

  loadProject(rowNum) {
    const name = this.props.projects[rowNum]._id;
    this.props.history.push(`/project/${name}`);
  }
  changePage(name) {
    this.props.history.push(`/${name}`);
  }
  handleEmptyProjects() {
    return (
      <EmptyMessage>
        <i>No projects to show</i>
        <StyledButton
          label="Click here to add"
          onClick={() => this.changePage('add')}
          labelPosition="before"
          icon={<AddIcon />}
          fullWidth
        />
      </EmptyMessage>
    );
  }
  render() {
    const { projects } = this.props;
    return (
      <GridCard>
        {projects && projects.length ? (
          <Table onCellClick={rowNum => this.loadProject(rowNum)}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Project</TableHeaderColumn>
                <TableHeaderColumn>Stargazers</TableHeaderColumn>
                <TableHeaderColumn>Forks</TableHeaderColumn>
                <TableHeaderColumn>Progress</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover>
              {projects.map(project => (
                <ClickableRow key={shortid.generate()}>
                  <TableRowColumn>{project.name}</TableRowColumn>
                  <TableRowColumn>{project.stargazers_count}</TableRowColumn>
                  <TableRowColumn>{project.forks_count}</TableRowColumn>
                  <TableRowColumn>
                    {project.percent === 100 ? (
                      <i>Finished</i>
                    ) : (
                      <CircularProgress />
                    )}
                  </TableRowColumn>
                </ClickableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          this.handleEmptyProjects()
        )}
      </GridCard>
    );
  }
}

const ClickableRow = styled(TableRow)`
  cursor: pointer;
`;

const EmptyMessage = styled.div`
  padding: 24px;
`;

const StyledButton = styled(FlatButton)`
  margin-top: 12px !important;
`;

const mapStateToProps = ({ projects }) => ({ projects });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ RECEIVE_PROJECTS }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTable);
