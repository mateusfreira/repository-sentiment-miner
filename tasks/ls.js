const util = require('../lib/util.js');

exports.run = (projectName, path, commit, cb) => {
    util.execPromise(`cd ${path}&&find .`).then(r => {
        commit.ls = r;
    }).asCallback(cb);
}
