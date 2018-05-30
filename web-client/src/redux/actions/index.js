import Service from '../../services/CommitMiner';
import Promise from 'bluebird';

export const RECEIVE_ONCE_CONTIBUTORS = 'RECEIVE_ONCE_CONTIBUTORS';
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const RECEIVE_WEEK_SENTIMENT = 'RECEIVE_WEEK_SENTIMENT';
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const RECEIVE_COMPARATIVE = 'RECEIVE_COMPARATIVE';
export const RECEIVE_MOST_SENTIMENTAL = 'RECEIVE_MOST_SENTIMENTAL';
export const RECEIVE_SWB = 'RECEIVE_SWB';
export const RECEIVE_MOST_SENTIMENTAL_DEVELOPERS =
  'RECEIVE_MOST_SENTIMENTAL_DEVELOPERS';
const service = Service.createService();

function receiveMostSentimentalDevelopers(sentimentals) {
  return {
    type: RECEIVE_MOST_SENTIMENTAL_DEVELOPERS,
    sentimentals
  };
}
function receiveSWB(swb) {
  return {
    type: RECEIVE_SWB,
    swb
  };
}

function receiveMostSentimental(mostSentimental) {
  return {
    type: RECEIVE_MOST_SENTIMENTAL,
    mostSentimental
  };
}
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
function receiveWeekSentiment(weekSentiment) {
  return {
    type: RECEIVE_WEEK_SENTIMENT,
    weekSentiment
  };
}
function receiveOnceContrinutor(onceContributors) {
  return {
    type: RECEIVE_ONCE_CONTIBUTORS,
    onceContributors
  };
}
export function fetchMostSentimentalDevelopers(project) {
  return function(dispatch) {
    return service.getMostSentimental(project).then(({ data }) => {
      dispatch(receiveMostSentimentalDevelopers(data));
    });
  };
}
export function fetchSWB(projectId) {
  return function(dispatch) {
    return service.getSwb(projectId).then(({ data }) => {
      dispatch(receiveSWB(data));
    });
  };
}
export function fetchMostSentimental(projectId) {
  return function(dispatch) {
    return service.getWrostAndBest(projectId).then(({ data }) => {
      dispatch(receiveMostSentimental(data));
    });
  };
}

export function fetchOnceContributors(projectId) {
  return function(dispatch) {
    return service.getOnceContributors(projectId).then(({ data }) => {
      dispatch(receiveOnceContrinutor(data));
    });
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

export function fetchWeekSentimentData(projectId) {
  return function(dispatch) {
    return service.getWeekDayeReport(projectId).then(({ data }) => {
      dispatch(receiveWeekSentiment(data));
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
