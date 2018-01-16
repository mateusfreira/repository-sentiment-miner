const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
const git = require('../lib/git.js');
const PersistenceManager = require('../model');
const Executor = require('../executor');
const util = require('../lib/util.js');
const logger = util.getLogger();

class ProjectAnaliser {
    constructor(projectUrl, projectName, tasks, outputer, nProcesses, resultPath) {
        this.persistenceManager = new PersistenceManager(resultPath);
        this.nProcesses = parseInt(nProcesses, 10) || 10;
        this.logger = util.getProjectLogger(projectName);
        this.executor = new Executor();
        this.outputer = outputer;
        this.project = {
            name: projectName,
            url: projectUrl,
            percent: 0
        };
        this.persistenceManager.addProject(this.project);
        this.commitsQueue = async.queue((commitBox, callback) => {
            this.logger.start(`process_${commitBox.commit.commit}`);
            const commitsFolder = `${resultPath}/${projectName}_commits`;
            return processSingleCommit(this, projectName, tasks, nProcesses, resultPath, commitsFolder, commitBox, callback).tap(() => {
                this.logger.end(`process_${commitBox.commit.commit}`);
                const percent = (_.filter(this.commits, '_processed').length / this.commits.length) * 100;
                this.project.percent = percent;
                this.logger.log(`processed ${percent}% of the commits`);
                this.storeProjectIfSafe();
            })
        }, nProcesses);
        this.analise = _.partial(this._analise, projectUrl, projectName, tasks, nProcesses, resultPath);
    }
    storeProjectIfSafe(force) {
        if (!this._saveProjectPromise || force) {
            this.project.commits = this.commits;
            this._saveProjectPromise = this.persistenceManager
                .updateProject(this.project)
                .then(() => this._saveProjectPromise = null);
        }
        return this._saveProjectPromise;
    }
    _analise(projectUrl, projectName, tasks, nProcesses, resultPath) {
        return git.clone(projectUrl, projectName, resultPath)
            .then(git.getCommitsAsJson.bind(git, resultPath, projectName))
            .then(this.runTaskForEachCommit.bind(this, projectName, tasks, nProcesses, resultPath))
            .tap(commitsDone.bind(null, this))
            .then(() => this.commits.map(c => {
                return _.omit(c, ['_pending', '_processed']);
            })).tap(commits => {
                this.storeProjectIfSafe(true);
                this.logger.start('callOuputer');
                return Promise.fromCallback(_.partial(this.outputer.export, projectName, resultPath, commits, util, this.logger)).tap(() => {
                    this.logger.end('callOuputer');
                });
            });
    }
    runTaskForEachCommit(projectName, tasks, nProcesses, resultPath, commits) {
        const commitsFolder = `${resultPath}/${projectName}_commits`;
        this.commits = commits;
        return util.execPromise(`rm -Rf ${commitsFolder}&&mkdir ${commitsFolder}`)
            .then(r => Promise.fromCallback(async.eachSeries.bind(null, commits, _.partial(prepareCommit, this, projectName, tasks, nProcesses, resultPath, commitsFolder))).then(() => commits));
    }
}

function commitsDone(analiser) {
    analiser.logger.start('checkPeddingCommits');
    analiser.notProcessed = analiser.commits;
    return new Promise((resolve) => {
        const canceler = setInterval(() => {
            analiser.notProcessed = _.filter(analiser.notProcessed, f => !f._processed);
            if (_.size(analiser.notProcessed) === 0) {
                clearTimeout(canceler);
                analiser.logger.end('checkPeddingCommits');
                resolve();
            }
        }, 1000);
    });
}

function needsMoreCommit(analiser) {
    return new Promise((resolve) => {
        const canceler = setInterval(() => {
            const pending = _.filter(analiser.commits, '_pending');
            if (_.size(pending) <= (analiser.nProcesses + 1)) {
                clearTimeout(canceler);
                resolve();
            } else {
                logger.info('needsMoreCommit', `waiting to prepare more commits ${pending.length} pending`);
            }
        }, 100);
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
            };
            commit._pending = true;
            self.commitsQueue.push(commitBox, () => {
                self.logger.log(`finished processing ${commitBox.commit.commit}`)
                commit._pending = false;
                commit._processed = true;
            });
        }).tap(_.partial(needsMoreCommit, self)).asCallback(callback);
}

function processSingleCommit(self, projectName, tasks, nProcesses, resultPath, commitsFolder, commitBox, callback) {
    const commitTasks = tasks.map(t => {
        return _.partial(t, projectName, commitBox.commitFolder, util, util.getProjectLogger(projectName));
    });
    return self.executor.executeTasks(commitTasks, commitBox.commit).tap(() => {
        return util.execPromise(`rm -Rf ${commitBox.commitFolder}`);
    }).asCallback(callback);

}

class ProjectsAnaliser {
    constructor(projects, tasks, outputer, nProcesses, resultPath) {
        this.tasks = tasks;
        this.outputer = outputer;
        this.nProcesses = nProcesses;
        this.projects = projects;
        this.resultPath = resultPath;
    }
    analise() {
        return Promise.fromCallback(async.forEachSeries.bind(null, this.projects, (project, cb) => {
            new ProjectAnaliser(project.url, project.name, this.tasks, this.outputer, this.nProcesses, this.resultPath).analise().asCallback(cb);
        }));
    }

}
module.exports.ProjectAnaliser = ProjectAnaliser;
module.exports.ProjectsAnaliser = ProjectsAnaliser;
