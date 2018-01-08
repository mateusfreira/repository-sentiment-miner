const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
const git = require('../lib/git.js');
const Executor = require('../executor');
const util = require('../lib/util.js');
const logger = util.getLogger();
class ProjectAnaliser {
    constructor(projectUrl, projectName, tasks, nProcesses, resultPath) {
        this.executor = new Executor();
        this.commitsQueue = async.queue((commit, callback) => {
            const commitsFolder = `${resultPath}/${projectName}_commits`;
            return processSingleCommit(this, projectName, tasks, nProcesses, resultPath, commitsFolder, commit, commit);
        }, nProcesses);
        this.analise = _.partial(this._analise, projectUrl, projectName, tasks, nProcesses, resultPath);
    }
    _analise(projectUrl, projectName, tasks, nProcesses, resultPath) {
        return git.clone(projectUrl, projectName, resultPath)
            .then(git.getCommitsAsJson.bind(git, resultPath, projectName))
            .then(this.runTaskForEachCommit.bind(this, projectName, tasks, nProcesses, resultPath))
            .tap(commitsDone)
    }
    runTaskForEachCommit(projectName, tasks, nProcesses, resultPath, commits) {
        const commitsFolder = `${resultPath}/${projectName}_commits`;
        this.commits = commits;
        return util.execPromise(`rm -Rf ${commitsFolder}&&mkdir ${commitsFolder}`)
            .then(r => Promise.fromCallback(async.eachSeries.bind(null, commits, _.partial(prepareCommit, this, projectName, tasks, nProcesses, resultPath, commitsFolder))).then(() => commits));
    }
}

function commitsDone(analiser) {
    analiser.notProcessed = analiser.commits;
    return new Promise((resolve) => {
        const canceler = setInterval(() => {
            analiser.notProcessed = _.filter(analiser.notProcessed, '_processed');
            if (_.size(analiser.notProcessed) === 0) {
                clearTimeout(canceler);
                resolve();
            }
        }, 1000)
    });
}

function prepareCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commit, callback) {
    const commitFolder = `${commitsFolder}/${commit.commit}`;
    return util.execPromise(`rm -Rf ${commitFolder}&&mkdir ${commitFolder}`)
        .finally(r => {
            return git.checkoutCommitToFolder(resultPath, projectName, commit.commit, commitFolder)
        })
        .then((c) => {
            const commitBox = {
                commit,
                commitFolder
            }
            self.commitsQueue.push(commitBox, () => {
                commit._processed = true;
            });
        }).asCallback(callback);
}

function processSingleCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commitBox, callback) {
    const commitTasks = tasks.map(t => {
        return _.partial(t, projectName, commitBox.commitFolder);
    });
    return self.executor.executeTasks(commitTasks, commitBox.commit).asCallback(callback);

}
module.exports = ProjectAnaliser;
