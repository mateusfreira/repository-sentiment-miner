const Promise = require('bluebird');
const _ = require('lodash');
const async = require('async');
const git = require('../lib/git.js');
const PersistenceManager = require('../model');
const Executor = require('../executor');
const util = require('../lib/util.js');
const logger = util.getLogger();

class Queue {
    constructor(type, fn, objPropertyName, idPropertyName, nProcesses, logger) {
        this.logger = logger;
        this.internalQueue = async.queue((box, callback) => {
            const obj = _.get(box, objPropertyName);
            this.logger.start(`process_${type}_${_.get(obj, idPropertyName)}`);
            obj._processing = true;
            obj._start = Date.now();
            return fn(box).tap(() => {
                this.logger.end(`process_${type}_${_.get(obj, idPropertyName)}`);
            }).catch((e) => {
                obj._error = true;
                obj._errorMessage = e.message;
                throw e;
            }).finally(() => {
                obj._end = Date.now();
                obj._processing = false;
            }).asCallback(callback);
        }, nProcesses)
    }
    push(box) {
        return Promise.fromCallback(this.internalQueue.push.bind(this.internalQueue, box));
    }
}
module.exports.Queue = Queue;
