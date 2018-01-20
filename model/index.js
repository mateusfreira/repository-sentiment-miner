const _ = require('lodash');
const util = require('../lib/util.js');

class PersistenceManager {
    constructor(resultPath) {
        this._resultPath = resultPath;
    }

    changeResultPath(path) {
        this._resultPath = path;
    }

    _getProjectFileName(project) {
        return `${this._resultPath}/${project.name}.db.json`;
    }

    addProject(project) {
        return util.writeObject(project, this._getProjectFileName(project));
    }

    updateProject(project) {
        return this.addProject(project);
    }
    getProject(name) {
        return util.readJsonFile(this._getProjectFileName({
            name
        }));
    }

    findProjectsName() {
        return util.execPromise(`ls -1f ${this._resultPath} | grep \.db\.json$`).then((r) => {
            return r.split('\n').filter(_.identity).map(fileName => {
                const name = fileName.replace('.db.json', '');
                return {
                    name
                };
            });
        });
    }

    saveConfig(config) {
        return util.writeObject(config, '/tmp/commits-miner-config.json');
    }

    loadConfig() {
        return util.readJsonFile('/tmp/commits-miner-config.json').catch(() => {  return {}; });
    }
}
module.exports = PersistenceManager;
