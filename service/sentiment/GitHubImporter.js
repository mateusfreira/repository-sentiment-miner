const config = require('config');
const _ = require('lodash');
const Promise = require('bluebird');
const async = require('async');
const gitHubUtil = require('../../lib/gitHubUtil.js');
class GitHubImporter {

    constructor() {

    }

    getProject(url) {
        const projectUrl = _.slice(url.split('/'), -2).join('/');
        return gitHubUtil
        .getData(`https://api.github.com/repos/${projectUrl}`);

    }
    getPulls(project) {

    }
    getCommits() {

    }
    getPullComments(pull) {

    }
    getPullCommits(pull) {

    }
    getPullReviews(pull) {

    }
}
module.exports.GitHubImporter = GitHubImporter;
