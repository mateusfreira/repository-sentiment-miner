const util = require('../lib/util.js');

exports.export = (projectName, path, commits, cb) => {
    util.writeObject(commits, `${path}/${projectName}_result.json`).asCallback(cb);
};
