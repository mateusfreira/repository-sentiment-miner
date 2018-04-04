const restify = require('restify');
const _ = require('lodash');
const {
    importProject
} = require('../service/sentiment/ProjectImport.js');
const {
    dayOfWeekSentiment,
    sentimentByType,
    worstAndTheBest,
    mostSentimental,
    onceContributors
} = require('../service/sentiment/Reports.js');

const ProjectAnaliser = require('../service/projectAnaliser.js').ProjectAnaliser;
const PersistenceManager = require('../model/index.js');
const persistenceManager = new PersistenceManager('/tmp');
const util = require('../lib/util.js');
const models = require('../model/mongo/index.js');
const Project = models.Project;
const PullComments = models.PullComments;
const logger = util.getLogger();
const {
    ObjectId
} = require('mongoose').Types.ObjectId;
const {
    processDevelopersProfile
} = require('../service/sentiment/DeveloperProcess.js');

async function restoreState(persistenceManager) {
    const projectsName = await persistenceManager.findProjectsName();
    projectsName.map(async project => {
        const projectData = await persistenceManager.getProject(project.name);
        console.log(projectData);
        if (!projectData.completed) {
            new ProjectAnaliser(projectData).analise();
        }
    })
}
async function init() {
    const config = await persistenceManager.loadConfig();
    console.log(config);
    persistenceManager.changeResultPath(config.resultPath || '/tmp');
    restoreState(persistenceManager);
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

    server.get('/import/:owner/:repo', async function(req, res, next) {
        console.log('receive start request...');
        const projectName = req.params.owner + "/" + req.params.repo;
        res.send({
            ok: true
        });
        next();
        const project = await importProject(projectName);
        console.log(`Project ${project.name}`);
    });

    server.post('/start', async function(req, res, next) {
        console.log('receive start request...');
        const url = req.body.url;
        const name = _.head(_.takeRight(url.split(/\.|\//), 2));
        const config = await persistenceManager.loadConfig();
        const nProcesses = config.nProcesses;
        const resultPath = config.resultPath;
        const tasks = config.tasks;
        const outputer = require(config.outputer);
        const project = {
            name,
            url,
            tasks,
            outputer,
            nProcesses,
            resultPath
        };
        console.log(project);
        new ProjectAnaliser(project).analise().catch(console.error);
        res.send({
            ok: true
        });
        next();
    });

    server.get('/list', function(req, res, next) {
        console.log('receive list request...');
        // persistenceManager.findProjectsName()
        Project.find().then(projects => {
            res.send(projects);
            next();
        });
    });

    server.get('/project/:id', function(req, res, next) {
        Project.findOne({
            _id: req.params.id
        }).then(project => {
            res.send(project);
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
            logger.error('API', e);
            res.send(404, 'project not found')
        })
    });

    server.get('/reports/sentimentByType', function(req, res, next) {
        const query = req.query;
        return sentimentByType({
            _project: ObjectId(query._project)
        }).then(r => {
            res.send(r);
            next();
        }).catch(e => {
            logger.error('API', e);
            res.send(404, 'not found');
        })
    });
    server.get('/reports/worstAndTheBest', function(req, res, next) {
        return worstAndTheBest({
            _project: ObjectId(req.query._project)
        }).then(r => {
            res.send(r);
            next();
        }).catch(e => {
            logger.error('API', e);
            res.send(404, 'not found');
        });
    });


    server.get('/reports/weekday', function(req, res, next) {
        return dayOfWeekSentiment({
            _project: ObjectId(req.query._project)
        }).then(r => {
            res.send(r);
            next();
        }).catch(e => {
            logger.error('api', e);
            res.send(404, 'not found');
        });
    });

    server.get('/process/developers', function(req, res, next) {
        processDevelopersProfile({
            _project: ObjectId(req.query._project)
        });
        res.send({
            ok: true
        });
        next();
    });

    server.get('/reports/once-contributors', function(req, res, next) {
        onceContributors(req.query._project).then((report) => {
            res.send(report);
            next();
        }).catch(e => {
            logger.error('api', e);
            res.send(404, 'not found');
        });
    });

    server.get('/reports/most-sentimental', function(req, res, next) {
        mostSentimental({
            'contribuitions.projects': req.query._project
        }).then((report) => {
            res.send(report);
            next();
        }).catch(e => {
            logger.error('api', e);
            res.send(404, 'not found');
        });
    });


    server.listen(8081, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

init();
