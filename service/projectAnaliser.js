const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
const git = require('../lib/git.js');
const Executor = require('../executor');
const util = require('../lib/util.js');
class ProjectAnaliser {
    constructor() {
        this.executor = new Executor();
    }
    analise(projectUrl, projectName, tasks, nProcesses, resultPath) {
        return git.clone(projectUrl, projectName, resultPath)
            .then(git.getCommitsAsJson.bind(git, resultPath, projectName))
            .then(this.runTaskForEachCommit.bind(this, projectName, tasks, nProcesses, resultPath));
    }
    runTaskForEachCommit(projectName, tasks, nProcesses, resultPath, commits) {
        const commitsFolder = `${resultPath}/${projectName}_commits`
        return util.execPromise(`rm -Rf ${commitsFolder}&&mkdir ${commitsFolder}`)
            .then(r => Promise.fromCallback(async.eachLimit.bind(null, commits, nProcesses, _.partial(processSingleCommit, this, projectName, tasks, nProcesses, resultPath, commitsFolder))).then(r => commits));
    }
}

function processSingleCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commit, callback) {
    const commitFolder = `${commitsFolder}/${commit.commit}`;
    util.execPromise(`rm -Rf ${commitFolder}&&mkdir ${commitFolder}`)
        .finally(r => {
            return git.checkoutCommitToFolder(resultPath, projectName, commit.commit, commitFolder)
        })
        .then((c) => {
            const commitTasks = tasks.map(t => {
                return _.partial(t, projectName, commitFolder);
            });
            return self.executor.executeTasks(commitTasks, commit);
        }).asCallback(callback);

}
module.exports = ProjectAnaliser;
