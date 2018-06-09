const config = require('config');
const _ = require('lodash');
const Promise = require('bluebird');
const async = require('async');
const gitHubUtil = require('../../lib/gitHubUtil.js');
const models = require("../../model/mongo/index.js");
const Developer = models.Developer;
const Pull = models.Pull;
const Project = models.Project;
const PullComments = models.PullComments;
const PullReviews = models.PullReviews;
const Commit = models.Commit;
const { processSWB } = require('../../service/sentiment/SubjectiveWellBeing.js');
const { processDevelopersProfile } = require('../../service/sentiment/DeveloperProcess.js');
const { SentimentTaskManager  } = require('./SentimentTaskManager.js');
const { Importer  } = require('./Importer.js');

const sentimentTaskManager = new SentimentTaskManager(config);

const pendingDevelopers = {};


let running;

function startDeveloperCreatorQueue() {
    Promise.map(_.keys(pendingDevelopers), (key) => {
        console.log(`Check ${key}`);
        return Developer.count({
            "value.login": key
        }).then(n => {
            if (n === 0) {
                console.log(`Creating a new developer ${key}`);
                return new Developer({
                    key,
                    value: pendingDevelopers[key]
                }).save().then(() => {
                    delete pendingDevelopers[key];
                });
            } else {
                delete pendingDevelopers[key];
            }
        });

    }, {
        concurrency: 5
    }).then(() => {
        const keys = _.keys(pendingDevelopers);
        if (running || keys.length !== 0) {
            console.log('Will run startDeveloperCreatorQueue again')
            setTimeout(startDeveloperCreatorQueue, 500);
        }
    });
}

function checkDeveloper(interaction) {
    const value = _.get(interaction, 'user', _.get(interaction, 'author'));
    const id = _.get(value, 'login');
    if (!id) return Promise.resolve();
    pendingDevelopers[id] = value;
}


function applySentiment(data) {
    return new Promise((resolve, reject) => {
        let finished = 0;
        const chunks_size = 100;
        const chunks = _.chunk(data, chunks_size);
        const nPoocesses = 9;
        async.eachLimit(chunks, nPoocesses, function(objs, callback) {
            Promise.map(sentimentTasksRunnable, (task) => {
                    return task(objs);
                }).asCallback(callback)
                .finally(() => {
                    finished++;
                    console.log(`Commits processed ${finished} / ${chunks.length}`, 'log');
                });
        }, function(err, result) {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

function importProject(projectUrl) {
    const importer = Importer.importerFactory(projectUrl);
    running = true;
    startDeveloperCreatorQueue();
    return  importer.getProject(projectUrl)
            .then((project) => {
            const mongoProject = new Project(project);
            mongoProject.set('_commits', undefined);
            mongoProject.set('_pulls', undefined);
            mongoProject.set('percent', 50);
            return mongoProject.save()
                .then(() => importer.getPulls(project))
                .then((pulls) => Promise.map(pulls, (pull) => {
                    return Promise.all([
                        importer.getPullComments(pull),
                        importer.getPullReviews(pull),
                        importer.getPullCommits(pull).then(commits => commits.map(c => {
                            c.body = _.get(c, 'commit.message');
                            return c;
                        })),
                        gitHubUtil.getData(pull.comments_url.replace('comments', 'events'))
                    ]).spread((_comments, _reviews, _commits, _events) => {
                        const interactions = _.flatten([pull, _comments, _reviews, _commits, _events]);
                        return sentimentTaskManager.applySentiment(interactions).then(() => Promise.map(interactions, interaction => {
                            interaction._project = mongoProject._id;
                            return checkDeveloper(interaction);
                        }).then(() => {
                            pull._events = _events;
                            const pullMongo = new Pull(pull);
                            return Promise.all([
                                pullMongo.save(),
                                Promise.all(_comments.map(c => {
                                    c._pull = pullMongo._id;
                                    return new PullComments(c).save();
                                })),
                                Promise.all(_reviews.map(c => {
                                    c._pull = pull._id;
                                    return new PullReviews(c).save();
                                })),
                            ]);
                        }).then(() => {
                            return Object.assign(pull, {
                                _commits,
                                _events
                            });
                        }));
                    });
                }, {
                    concurrency: 1
                })).then((pulls) => {
                    return project;
                }).then(function(project) {
                    return importer.getCommits(project)
                        .then( (commits) => sentimentTaskManager.applySentiment(commits.map((c) => {
                            c.body = _.get(c, 'commit.message')
                            return c;
                        }), mongoProject)
                        .then(commits => commits.map(c => {
                            c._project = mongoProject._id;
                            return new Commit(c).save();
                        }))
                        .then(() => project));
                }).then(function(project) {
                    mongoProject.set('percent', 100);
                    return mongoProject.save();
                });
        }).then(project => {
            console.log(project.full_name);
            running = false;
            return project;
        }).then((project) => {
            return Promise.all([processSWB(project._id), processDevelopersProfile(project._id)]);
        });
}
module.exports.importProject = importProject;
