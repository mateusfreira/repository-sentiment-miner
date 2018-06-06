const config = require('config');
const _ = require('lodash');
const Promise = require('bluebird');
const async = require('async');
const request = require('request');
const tokens = _.get(config, 'gitLab.tokens', []);

class GitLabImporter {
    getProject(url) {
        const projectUrl = _.slice(url.split('/'), -2).join('/');
        const requestUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectUrl)}`;
        return getGitLabData(requestUrl);
    }
    getPulls(project) {}
    getCommits() {

    }
    getPullComments(pull) {}
    getPullCommits(pull) {

    }
    getPullReviews(pull) {}
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
