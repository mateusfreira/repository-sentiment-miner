import axios from 'axios';

class CommitMiner {
  constructor(domain) {
    this.domain = domain;
  }

  getConfiguration() {
    return axios.get(`http://${this.domain}:8081/config`);
  }

  updateConfig(config) {
    return axios.post(`http://${this.domain}:8081/config`, config);
  }

  startProject(url) {
    return axios.get(`http://${this.domain}:8081/import/${url}`, {
      url: url
    });
  }

  getProjectState(projectName) {
    return axios.get(`http://${this.domain}:8081/project/${projectName}`);
  }

  getProjectList() {
    return axios.get(`http://${this.domain}:8081/list`);
  }

  getProjectStatus(project) {
    return axios.get(
      `http://${this.domain}:8081/project/status/${project.name}`
    );
  }

  getInteractionsReport(project) {
    return axios.get(
      `http://${this.domain}:8081/reports/sentimentByType?_project=${project}`
    );
  }

  getWeekDayeReport(project) {
    return axios.get(
      `http://${this.domain}:8081/reports/weekday?_project=${project}`
    );
  }

  getWrostAndBest(project) {
    return axios.get(
      `http://${this.domain}:8081/reports/worstAndTheBest?_project=${project}`
    );
  }

  getMostSentimental(project) {
    return axios.get(
      `http://${this.domain}:8081/reports/most-sentimental?_project=${project}`
    );
  }

  getOnceContributors(project) {
    return axios.get(
      `http://${this.domain}:8081/reports/once-contributors?_project=${project}`
    );
  }
}
export default CommitMiner;
