const util = require('../lib/util.js');

exports.run = (command, propertyName, projectName, path, util, logger, commit, cb) => {
    util.execPromise(`${command} ${projectName} "${path}" '${JSON.stringify(commit)}'`).then((r) => {
        try {
            commit[propertyName] = JSON.parse(r);
        } catch (e) {
            logger.log(e);
            commit[propertyName] = r;
        }
    }).asCallback(cb);
};
