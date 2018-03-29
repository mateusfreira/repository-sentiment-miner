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

const applySentiStrengthStanfordParser = require('../../../github-sentiment-analysis-code-smells-scripts/sentistrength-stanford-parser')
    .applySentiStrengthStanfordParser;
const isOffencive = require('../../../github-sentiment-analysis-code-smells-scripts/is-it-ofensive.js');
const tasks = [_.partialRight(applySentiStrengthStanfordParser, true), (data, field, cp, grouped) => {
    data.forEach(interaction => {
        interaction.offencive = isOffencive(interaction.body || interaction.message || '');
    });
    cp();
}, (data, field, cp, grouped) => {
    data.forEach(i => i.created_at = new Date(i.created_at))
    cp();
}];

function checkDeveloper(interaction) {
    const value = _.get(interaction, 'user', _.get(interaction, 'author'));
    const id = _.get(value, 'login');
    return Developer.count({
        "value.login": id
    }).then(n => {
        if (n === 0 && id) {
            console.log(`Creating a new developer ${_.get(interaction, 'user.login')}`)
            return new Developer({
                id,
                value
            }).save();
        }
    })
}

function applySentiment(data) {
    return new Promise((resolve, reject) => {
        let finished = 0;
        const chunks_size = 100;
        console.log(chunks_size);
        const chunks = _.chunk(data, chunks_size);
        const nPoocesses = 9;
        async.eachLimit(chunks, nPoocesses, function(obj, callback) {
            async.parallel(tasks.map((task) => {
                return _.partial(task, obj, 'body');
            }), (err) => {
                finished++;
                console.log(`Commits processed ${finished} / ${chunks.length}`, 'log');
                callback(err);
            });
        }, function(err, result) {
            if (err) return reject(err);
            return resolve(data);
        })
    })
}

function importProject(projectUrl) {
    return gitHubUtil
        .getData(`https://api.github.com/repos/${projectUrl}`, ['pulls_url', 'commits_url'])
        .then((project) => {
            return Promise.map(project._pulls, (pull) => {
                return Promise.all([
                    gitHubUtil.getData(pull.comments_url),
                    gitHubUtil.getData(pull.review_comments_url),
                    gitHubUtil.getData(pull.commits_url).then(commits => commits.map(c => {
                        c.body = c.message;
                        return c;
                    })),
                    gitHubUtil.getData(pull.comments_url.replace('comments', 'events'))
                ]).spread((_comments, _reviews, _commits, _events) => {
                    const interactions = _.flatten([pull, _comments, _reviews, _commits, _events]);
                    return applySentiment(interactions).then(() => Promise.map(interactions, interaction => {
                        return checkDeveloper(interaction);
                    }).then(() => {
                        delete pull._commits;
                        delete pull._comments;
                        delete pull._reviews;
                        pull._events = _events;
                        const pullMongo = new Pull(pull);
                        return Promise.all([
                            pullMongo.save(),
                            Promise.all(_comments.map(c => {
                                c._pull = pull._id;
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
            }).then((pulls) => {
                return project;
            }).then(function(project) {
                return Promise.all(project._commits.map(c => new Commit(c).save())).then(() => project);
            }).then(function(project) {
                delete project._commits;
                delete project._pulls;
                return new Project(project).save();
            });
        }).then(project => {
            console.log(project.full_name);
            return project;
        });
}
module.exports.importProject = importProject;
