const _ = require('lodash');
const util = require('./util.js');
exports.clone = (projectUrl, projectName, resultPath) => {
    const logger = util.getProjectLogger(projectName);
    logger.start('cloneProject');
    const command = `cd  ${resultPath}&&git clone ${projectUrl}`;
    return util.execPromise(command).then(_.ary(_.partial(logger.end, 'cloneProject'))).catch((e) => {
        const alreadyExists = _.includes(_.get(e, 'message', ''), 'already exists');
        if (!alreadyExists) {
            throw e;
        } else {
            return exports.moveToMaster(resultPath, projectName.replace('.git', ''));
        }
    });
};
exports.moveToMaster = (resultPath, path) => {
    return exports.moveTo(resultPath, path, 'master');
};

exports.moveTo = (resultPath, path, branch) => {
    const command = `cd  ${resultPath}/${path}&&git checkout ${branch} -f`;
    return util.execPromise(command);

};
/**
 * Sugar method to moveTo
 */
exports.checkoutCommit = exports.moveTo;
exports.checkoutCommitToFolder = (resultPath, path, commitHash, commitFolder) => {
    const command = `cd  ${resultPath}/${path}&&git --work-tree=${commitFolder} checkout ${commitHash} -- .`;
    return util.execPromise(command);
}

exports.getCommitsAsJson = (path, projectName) => {
    const logger = util.getProjectLogger(projectName);
    logger.start('getCommitsAsJson');
    return util.execPromise(`cd ${path}/${projectName} &&git log --pretty=format:'{  $$-$$commit$$-$$##$## $$-$$%H$$-$$,  $$-$$abbreviated_commit$$-$$##$## $$-$$%h$$-$$,  $$-$$tree$$-$$##$## $$-$$%T$$-$$,  $$-$$abbreviated_tree$$-$$##$## $$-$$%t$$-$$,  $$-$$parent$$-$$##$## $$-$$%P$$-$$,  $$-$$abbreviated_parent$$-$$##$## $$-$$%p$$-$$,  $$-$$refs$$-$$##$## $$-$$%D$$-$$,  $$-$$encoding$$-$$##$## $$-$$%e$$-$$,  $$-$$comment$$-$$##$## $$-$$%s$$-$$,  $$-$$sanitized_subject_line$$-$$##$## $$-$$%f$$-$$,  $$-$$verification_flag$$-$$##$## $$-$$%G?$$-$$,  $$-$$signer$$-$$##$## $$-$$%GS$$-$$,  $$-$$signer_key$$-$$##$## $$-$$%GK$$-$$,  $$-$$author$$-$$##$## {    $$-$$name$$-$$##$## $$-$$%aN$$-$$,    $$-$$email$$-$$##$## $$-$$%aE$$-$$,    $$-$$date$$-$$##$## $$-$$%aD$$-$$  },  $$-$$commiter$$-$$##$## {    $$-$$name$$-$$##$## $$-$$%cN$$-$$,    $$-$$email$$-$$##$## $$-$$%cE$$-$$,    $$-$$date$$-$$##$## $$-$$%cD$$-$$  }}%n'`).then(function(text) {
        logger.end('getCommitsAsJson');
        return text.replace(/\"|\\|\'|\`|\:|\t/g, '').replace(/\$\$\-\$\$/g, '\"').replace(/##\$##/g, ':').split('\n')
            .filter(_.identity).map(JSON.parse);
    });
};
