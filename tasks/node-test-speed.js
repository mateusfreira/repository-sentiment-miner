exports.run = (projectName, path, util, logger, commit, cb) => {
    logger.start('install');
    util.execPromise(`cd ${path}&&npm i`).then(() => { //Install the dependecies
        logger.end('install');
        const start = new Date();
        return util.execPromise(`cd ${path}&&npm test`).finally(() => { //Calculate the time even if the test fails
            const end = new Date();
            commit.testSlapsedTime = end - start;
        }).catch(() => logger.log('test is broken'));
    }).asCallback(cb);
};
