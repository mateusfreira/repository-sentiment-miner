const _ = require('lodash');
const applyStrategy = {
    'single-sync': (messages, method) => Promise.resolve(messages.map(method)),
    'mult-async': (messages, method) => method(messages)
};
class SentimentTask {
    constructor(config) {
        this.config = config;
    }

    getInstance() {
        if (!this.taskIntance) {
            const _module = require(this.config.fileName);
            const taskClass = _.get(_module, this.config.className, _module);
            this.taskIntance = new taskClass(this.config.config);
        }
        return this.taskIntance;
    }

    apply(messages = []) {
        const taskIntance = this.getInstance();
        return applyStrategy[this.config.stratefy || 'mult-async'](messages, taskIntance[this.config.methodName].bind(taskIntance));
    }
}

module.exports.SentimentTask = SentimentTask;