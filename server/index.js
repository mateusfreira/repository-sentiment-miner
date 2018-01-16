const restify = require('restify');
const _ = require('lodash');
const ProjectAnaliser = require('../service/projectAnaliser.js').ProjectAnaliser;
const PersistenceManager = require('../model/index.js');
const server = restify.createServer({
    name: 'commits-miner',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(
    function crossOrigin(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);
server.get('/start', function(req, res, next) {
    const url = req.query.url;
    const name = _.head(_.takeRight(url.split(/\.|\//), 2));
    const nProcess = req.query.processes;
    const project = {
        name,
        url
    };
    new ProjectAnaliser(project.url, project.name, [require('../tasks/ls.js').run], require('../output/jsonFile.js'), project.nProcess || 10, '/tmp').analise();
    res.send({
        ok: true
    });
    next();
});
server.get('/list', function(req, res, next) {
    const persistenceManager = new PersistenceManager('/tmp');
    persistenceManager.findProjectsName().then(projects => {
        res.send(projects);
        next();
    })
});

server.get('/project/:name', function(req, res, next) {
    const persistenceManager = new PersistenceManager('/tmp');
    persistenceManager.getProject(req.params.name).then(projects => {
        res.send(projects);
        next();
    }).catch(e => {
        res.send(404, 'project not found')
    })
});

server.get('/project/status/:name', function(req, res, next) {
    const persistenceManager = new PersistenceManager('/tmp');
    persistenceManager.getProject(req.params.name).then(project => {
        const projectToReturn = _.pick(project, ['name', 'percent']);
        projectToReturn.commitsCount = project.commits.length;
        projectToReturn.processedCount = _.filter(project.commits, '_processed').length;
        res.send(projectToReturn);
        next();
    }).catch(e => {
        res.send(404, 'project not found')
    })
});


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
