const config = require('config');
const tokens = config.get('github.tokens');
const request = require('request');
const Promise = require('bluebird');
const async = require('async');
const _ = require('lodash');
const asyncMap = Promise.promisify(async.map);
const asyncForEachLimit = Promise.promisify(async.forEachLimit);
const util = require('./util.js');
const Processes = {
    pendding: 0
};
const log = function() {};
let currentToken = 0;

function _requestData(obj, property, allowObject, tokens) {
    const resultProperty = `_${property.replace("_url", '')}`;
    if (!obj[property]) return Promise.resolve([]);
    if (obj[resultProperty]) return Promise.resolve(obj[resultProperty]);
    return new Promise(function(resolve, reject) {
        let waits = 0;
        getData();

        function getData() {
            if (Processes.pendding > 30) {
                waits++;
                log(`Delaying the call of ${obj[property]} for the ${waits} time`);
                setTimeout(getData, 3000);
                return;
            }
            Processes.pendding++;
            const _urlCandidate = obj[property].replace("{/number}", '').replace(/\{\/other_user\}|\{\/sha\}/, "");
            const hasAllPages = _urlCandidate.indexOf("state=all") != -1;
            const url = hasAllPages ? _urlCandidate : _urlCandidate + "?state=all&per_page=100";
            const headers = {
                'User-Agent': 'request-node leasdle research project',
            };
            if (_.size(tokens) > 0) {
                headers["Authorization"] = `token ${tokens[currentToken]}`;
            }
            const requestData = {
                url: url,
                headers
            };
            requestData.token = currentToken;
            request(requestData, function(err, response) {
                Processes.pendding--;
                if (err || (response.statusCode !== 200 && response.statusCode !== 403)) { //403 is handled lather
                    return reject(err || _.get(response, 'statusMessage') + requestData.url);
                }
                const nextPage = response.headers.link && response.headers.link.split(',').filter((s) => ~s.indexOf('rel="next'));
                const data = JSON.parse(response.body);
                if (!_.isArray(data) && !allowObject) {
                    if (requestData.token === currentToken) {
                        currentToken++;
                    }
                    if (currentToken >= tokens.length) {
                        reject('Hate limit');
                    } else {
                        log("--------------------Changing the token to acess github -------------------");
                        return getData();
                    }
                }
                if (nextPage && nextPage.length === 1) {
                    obj[property] = nextPage[0].split(";")[0].replace(/<|>/g, '');
                    return _requestData(obj, property, undefined, tokens).then(function(childData) {
                        obj[resultProperty] = data.concat(childData);
                        resolve(obj[resultProperty]);
                    });
                } else {
                    obj[resultProperty] = data;
                    resolve(data);
                }
            });
        }
    });

}

module.exports.getData = function(url, dependencies = []) {
    const result = {
        "data_url": url
    };
    return _requestData(result, "data_url", true, tokens).then((result) => {
        return Promise.map(dependencies, d => _requestData(result, d)).then(_.wrap(result));
    });
}
