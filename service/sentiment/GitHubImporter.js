const config = require('config');
const _ = require('lodash');
const Promise = require('bluebird');
const async = require('async');
const gitHubUtil = require('../../lib/gitHubUtil.js');
class GitHubImporter {
    getProject(url) {
        const projectUrl = _.slice(url.split('/'), -2).join('/');
        return gitHubUtil
            .getData(`https://api.github.com/repos/${projectUrl}`);

    }
    getPulls(project) {
        return gitHubUtil.getData(project.pulls_url);
    }

    getCommits(project) {
        return gitHubUtil.getData(project.commits_url)
    }
    getPullComments(pull) {
        return gitHubUtil.getData(pull.comments_url);
    }

    getPullCommits(pull) {
        return this.getCommits(pull);
    }
    getPullReviews(pull) {
        return gitHubUtil.getData(pull.review_comments_url.replace('comments', 'reviews'));
    }
}
module.exports.GitHubImporter = GitHubImporter;
