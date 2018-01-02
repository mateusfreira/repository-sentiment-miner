const _  = require('lodash');
const util = require('./util.js');
exports.clone = (projectUrl, projectName, resultPath) => {
    const logger = util.getProjectLogger(projectName);
    logger.start('cloneProject');
    const command = `cd  ${resultPath}&&git clone ${projectUrl}`;
    return util.execPromise(command).then(logger.end.bind(null, 'cloneProject')).catch((e) => {
        const alreadyExists = _.includes(_.get(e, 'message', ''), 'already exists');
        if (!alreadyExists) {
            throw e;
        } else {
            return exports.moveToMaster(resultPath, projectName.replace('.git', ''));
        }
    });
};
exports.moveToMaster = (resultPath, path) => {
    const command = `cd  ${resultPath}/${path}&&git checkout master -f`;
    return util.execPromise(command);
};
