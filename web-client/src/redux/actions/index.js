import Service from '../../services/CommitMiner';

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const FETCH_PROJECTS = 'FETCH_PROJECTS';

const service = Service.createService();

function receiveProjects(json) {
  return {
    type: RECEIVE_PROJECTS,
    projects: json.data,
    receivedAt: Date.now()
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
