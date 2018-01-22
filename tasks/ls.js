const util = require('../lib/util.js');

exports.run = (projectName, path, util, logger, commit, cb) => {
    util.execPromise(`cd ${path}&&find .`).then(r => {
        commit.ls = r;
    });
    //asCallback(cb);
    const someNumber = Math.random() * 10000;
    setTimeout(cb, 10000 + someNumber); //Simulate slow process
}
