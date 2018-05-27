import Service from '../../services/CommitMiner';
import Promise from 'bluebird';
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const RECEIVE_COMPARATIVE = 'RECEIVE_COMPARATIVE';
const service = Service.createService();

function receiveProjects(json) {
  return {
    type: RECEIVE_PROJECTS,
    projects: json.data,
    receivedAt: Date.now()
  };
}

function receiveProject(json) {
  return {
    type: RECEIVE_PROJECT,
    project: json.data,
    receivedAt: Date.now()
  };
}

function receiveComparativeData(comparative) {
  return {
    type: RECEIVE_COMPARATIVE,
    comparative
  };
}

export function fetchComparativeData(projectId) {
  return function(dispatch) {
    return Promise.props({
      project: service.getInteractionsReport(projectId),
      general: service.getInteractionsReport()
    }).then(comparative => {
      dispatch(receiveComparativeData(comparative));
    });
  };
}
export function fetchProject(projectId) {
  return function(dispatch) {
    //Register request
    return service.getProjectState(projectId).then(json => {
      dispatch(receiveProject(json));
    });
  };
}
export function fetchProjects() {
  return function(dispatch) {
    //Register request
    return service.getProjectList().then(json => {
      dispatch(receiveProjects(json));
    });
  };
}
