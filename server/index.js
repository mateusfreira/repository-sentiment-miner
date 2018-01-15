const restify = require('restify');
const _ = require('lodash');
const ProjectAnaliser = require('../service/projectAnaliser.js').ProjectAnaliser;
const server = restify.createServer({
    name: 'commits-miner',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/start', function(req, res, next) {
    const url = req.query.url;
    const name = _.head(_.takeRight(url.split(/\.|\//), 2));
    const nProcess = req.query.processes;
    const project = {
        name,
        url
    };
    return new ProjectAnaliser(project.url, project.name, [require('../tasks/ls.js').run], require('../output/jsonFile.js'), project.nProcess || 10, '/tmp').analise().then((c) => res.send(c)).then(() => next());
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
