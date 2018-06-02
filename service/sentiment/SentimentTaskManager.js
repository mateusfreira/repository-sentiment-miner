const async = require('async');
const Promise = require('bluebird');
const _ = require('lodash');
const {
    SentimenTask
} = require('./SentimenTask.js');
class SentimentTaskManager {
    constructor(config) {
        this.config = config;
    }
    getSentmentTasks() {
        if (!this.sentimentTasksRunnable) {
            const sentimentTasks = _.get(this.config, 'sentiment.tasks', []);
            this.sentimentTasksRunnable = sentimentTasks.map((config) => {
                const sentimentTask = new SentimenTask(config);
                return (interactions) => {
                    return sentimentTask.apply(interactions.map(interaction => interaction.body || interaction.message || ''))
                        .then((result) => {
                            interactions.forEach((interaction, i) => {
                                interaction[config.propertyName] = result[i];
                            });
                            return interactions;
                        });
                };
            });
        }
        return this.sentimentTasksRunnable;
    }

    applySentiment(interactions) {
        const self = this;
        return new Promise((resolve, reject) => {
            let finished = 0;
            const chunks_size = 100;
            const chunks = _.chunk(interactions, chunks_size);
            const nPoocesses = 9;
            async.eachLimit(chunks, nPoocesses, function(objs, callback) {
                Promise.map(self.getSentmentTasks(), (task) => {
                        return task(objs);
                    }).asCallback(callback)
                    .finally(() => {
                        finished++;
                        console.log(`Interactions processing ${finished} / ${chunks.length}`);
                    });
            }, (err, result) => {
                if (err) return reject(err);
                return resolve(interactions);
            });
        });
    }
}

module.exports.SentimentTaskManager = SentimentTaskManager;
