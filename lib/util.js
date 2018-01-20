const _ = require("lodash");
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';
const fs = require("fs");
const bigJson = require('big-json');
const Promise = require("bluebird");
const exec = require('child_process').exec;
const execPromise = Promise.promisify(exec);
const async = require('async');
const asyncMap = Promise.promisify(async.map);
const asyncForEachLimit = Promise.promisify(async.forEachLimit);
const END = 'end';
const START = 'start';
const LOG = 'log';
const logMap = {
    'log': (projectName, log) => {
        logger.log(projectName, log);
    },
    'start': (projectName, log) => {
        logger.log(projectName, 'Starting', log);
        console.time(log);
    },
    'end': (projectName, log) => {
        console.timeEnd(log);
        logger.log(projectName, "Finishing", log);
    }
};
exports.getLogger = () => logger;
exports.logProcess = (log, status, projectName) => {
    logMap[status](projectName, `[${projectName}]:${log}`);
}
exports.logProcessStart = (log, projectName) => exports.logProcess(log, START, projectName);
exports.logProcessEnd = (log, projectName) => exports.logProcess(log, END, projectName);
exports.logProcessLog = (log, projectName) => exports.logProcess(log, LOG, projectName);

exports.writeObject = (obj, fileName) => {
    return new Promise((resolve, reject) => {
        const stringifyStream = bigJson.createStringifyStream({
            body: obj
        });
        const writeStream = fs.createWriteStream(fileName);
        stringifyStream.pipe(writeStream);
        writeStream.on('error', reject);
        stringifyStream.on('end', resolve);
    });
};

exports.readJsonFile = (fileName) => {
    return Promise.try(() => new Promise((resolve, reject) => {
        if (fs.existsSync(fileName)) {

            const readStream = fs.createReadStream(fileName);
            const parseStream = bigJson.createParseStream();
            parseStream.on('data', resolve);
            parseStream.on('error', reject);
            readStream.pipe(parseStream);
        } else {
            reject('File does not exist!')
        }
    }));
};

exports.execPromise = (command) => {
    //logger.log('execPromise', `executing command: ${command}`)
    return execPromise(command, {
        maxBuffer: 1024 * 500
    });
};

exports.asyncMap = asyncMap;
exports.asyncForEachLimit = asyncForEachLimit;
exports.getProjectLogger = (projectName) => {
    return {
        log: _.partialRight(exports.logProcessLog, projectName),
        start: _.partialRight(exports.logProcessStart, projectName),
        end: _.partialRight(exports.logProcessEnd, projectName)
    };
};
