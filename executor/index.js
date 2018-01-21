const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
class Executor {
    executeTasks(tasks, obj, callback) {
        return Promise.fromCallback(async.parallel.bind(null, tasks.map((task) => {
            return _.partial(task, obj);
        }))).then(r => obj);
    }
    executeAllTasks(tasks, objs) {
        return Promise.fromCallback(_.partial(async.eachSeries, objs, (obj, callback) => {
            this.executeTasks(tasks, obj).asCallback(callback);
        })).then(r => objs);
    }
}
module.exports = Executor
