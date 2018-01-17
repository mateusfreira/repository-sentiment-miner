const restify = require('restify');
const _ = require('lodash');
const ProjectAnaliser = require('../service/projectAnaliser.js').ProjectAnaliser;
const PersistenceManager = require('../model/index.js');
const persistenceManager = new PersistenceManager('/tmp');
async function init() {
    const config = await persistenceManager.loadConfig();
    console.log(config);
    persistenceManager.changeResultPath(config.resultPath || '/tmp');
    const server = restify.createServer({
        name: 'commits-miner',
        version: '1.0.0'
    });

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.opts(/.*/, (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, ");
        res.send(204);
        return next();
    });
    server.use(
        function crossOrigin(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, ");
            return next();
        }
    );

    server.get('/config', async function(req, res, next) {
        const config = await persistenceManager.loadConfig();
        res.send(config);
        next();
    });


    server.post('/config', (req, res, next) => {
        const config = {
            resultPath: req.body.resultPath,
            nProcesses: req.body.nProcesses,
            tasks: req.body.tasks,
            outputer: req.body.outputer
        };
        persistenceManager.saveConfig(config).then(() => {
            res.send({
                ok: true
            });
            next();
        });
    });

    server.get('/start', async function(req, res, next) {
        const url = req.query.url;
        const name = _.head(_.takeRight(url.split(/\.|\//), 2));
        const config = await persistenceManager.loadConfig();
        const nProcess = config;
        const resultPath = config.resultPath;
        const tasks = config.tasks = config.tasks.split(',').map(task => require(task.trim()).run);
        const outputer = require(config.outputer);
        const project = {
            name,
            url
        };
        new ProjectAnaliser(project.url, project.name, tasks, outputer, config.nProcesses || 10, config.resultPath).analise().catch(console.error);
        res.send({
            ok: true
        });
        next();
    });
    server.get('/list', function(req, res, next) {
        persistenceManager.findProjectsName().then(projects => {
            res.send(projects);
            next();
        });
    });

    server.get('/project/:name', function(req, res, next) {
        persistenceManager.getProject(req.params.name).then(projects => {
            res.send(projects);
            next();
        }).catch(e => {
            res.send(404, 'project not found')
        })
    });

    server.get('/project/status/:name', function(req, res, next) {
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
}
init();
