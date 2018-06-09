const config = require('config');
const _ = require('lodash');
const Promise = require('bluebird');
const async = require('async');
const request = require('request');
const tokens = _.get(config, 'gitLab.tokens', []);

const GIT_LAB_API = 'https://gitlab.com/api/v4';

class GitLabImporter {
    getProject(url) {
        const projectUrl = _.slice(url.split('/'), -2).join('/');
        const requestUrl = `${GIT_LAB_API}/projects/${encodeURIComponent(projectUrl)}`;
        return getGitLabData(requestUrl);
    }

    getPulls(project) {
        return getGitLabData(project._links.merge_requests);

    }

    getCommits(project) {
        return getGitLabData(`${GIT_LAB_API}/projects/${project.id}/repository/commits`);
    }

    getPullComments(pull) {
        return getGitLabData(`${GIT_LAB_API}/projects/${pull.project_id}/merge_requests/${pull.iid}/notes`).then(notes => _.filter(notes,  { "type": null }))
    }
    getPullCommits(pull) {
        return getGitLabData(`${GIT_LAB_API}/projects/${pull.project_id}/merge_requests/${pull.iid}/commits`);
    }

    getPullReviews(pull) {
        return getGitLabData(`${GIT_LAB_API}/projects/${pull.project_id}/merge_requests/${pull.iid}/notes`).then(notes => _.filter(notes,  { "type": "DiffNote" }));
    }
}

function getGitLabData(uri, method = `GET`) {
    const headers = {
        'User-Agent': 'request-node leasdle research project',
    };
    if (_.size(tokens) > 0) {
        headers["Private-Token"] = tokens[0];
    }
    const requestData = {
        method,
        uri,
        headers
    };
    return Promise.fromCallback(request.bind(request, requestData))
        .then(response => response.body)
        .then(JSON.parse);
}

module.exports.GitLabImporter = GitLabImporter;
