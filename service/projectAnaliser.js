const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
const git = require('../lib/git.js');
const Executor = require('../executor');
const util = require('../lib/util.js');
class ProjectAnaliser {
    constructor() {
        this.executor = new Executor();
        this.commtsReady = [];
    }
    analise(projectUrl, projectName, tasks, nProcesses, resultPath) {
        return git.clone(projectUrl, projectName, resultPath)
            .then(git.getCommitsAsJson.bind(git, resultPath, projectName))
            .then(this.runTaskForEachCommit.bind(this, projectName, tasks, nProcesses, resultPath));
    }
    runTaskForEachCommit(projectName, tasks, nProcesses, resultPath, commits) {
        const commitsFolder = `${resultPath}/${projectName}_commits`
        return util.execPromise(`rm -Rf ${commitsFolder}&&mkdir ${commitsFolder}`)
            .then(r => Promise.fromCallback(async.eachSeries.bind(null, commits, _.partial(prepareCommit, this, projectName, tasks, nProcesses, resultPath, commitsFolder))).then(r => commits)).then(() => {
                return util.asyncForEachLimit(this.commtsReady, nProcesses, _.partial(processSingleCommit, this, projectName, tasks, nProcesses, resultPath, commitsFolder))
            }).then(() => commits)
    }
}

function prepareCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commit, callback) {
    const commitFolder = `${commitsFolder}/${commit.commit}`;
    return util.execPromise(`rm -Rf ${commitFolder}&&mkdir ${commitFolder}`)
        .finally(r => {
            return git.checkoutCommitToFolder(resultPath, projectName, commit.commit, commitFolder)
        })
        .then((c) => {
            self.commtsReady.push({
                commit,
                commitFolder
            });
        }).asCallback(callback);
}

function processSingleCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commitBox, callback) {
    const commitTasks = tasks.map(t => {
        return _.partial(t, projectName, commitBox.commitFolder);
    });
    return self.executor.executeTasks(commitTasks, commitBox.commit).asCallback(callback);

}
class Worker {
    constructor(name) {
        this.state = 'ready';
        this.name = name;
    }

    do(commit) {
        this.state = 'running';
        logger.info('worker', `Worker[${this.name}]`, `Running the commit ${commit.commit}`);
        return this.action(commit).then(r => this.state = 'ready');
    }
}
module.exports = ProjectAnaliser;
