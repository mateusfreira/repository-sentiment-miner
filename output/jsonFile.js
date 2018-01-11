exports.export = (projectName, path, commits, util, logger, cb) => {
    util.writeObject(commits, `${path}/${projectName}_result.json`).asCallback(cb);
};
