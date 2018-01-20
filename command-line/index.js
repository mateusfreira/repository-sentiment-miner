#!/usr/bin/env node

const util = require('../lib/util.js');
const ProjectAnaliser = require('../service/projectAnaliser.js').ProjectAnaliser;
const ProjectsAnaliser = require('../service/projectAnaliser.js').ProjectsAnaliser;
const program = require('commander');
program
    .version('0.0.1')
    .description('Commits miner helper');

program
    .command('lser <gitUrl> <resultPath> <projectName> [processes]')
    .alias('ls')
    .description('this is test command')
    .action((gitUrl, resultPath, projectName, nProcesses) => {
        new ProjectAnaliser(gitUrl, projectName, [require('../tasks/ls.js').run], require('../output/jsonFile.js'), nProcesses || 10, resultPath).analise().then(console.log);
    });

program
    .command('execNode <taskFile> <gitUrl> <resultPath> <projectName> [processes] [outputer]')
    .alias('en')
    .description('execute a node file agains the script')
    .action((taskFile, gitUrl, resultPath, projectName, nProcesses, outputer) => {
        outputer = outputer || '../output/jsonFile.js';
        new ProjectAnaliser(gitUrl, projectName, [require(taskFile).run], require(outputer), nProcesses || 10, resultPath).analise().then(() => console.log('finished'));
    });
program
    .command('execCommand <command> <resultName> <gitUrl> <resultPath> <projectName> [processes] [outputer]')
    .alias('ec')
    .description('execute command line for each commit')
    .action((command, resultName, gitUrl, resultPath, projectName, nProcesses, outputer) => {
        const tasks = [require('../tasks/external-command.js').run.bind(null, command, resultName)];
        outputer = outputer || '../output/jsonFile.js';
        new ProjectAnaliser(gitUrl, projectName, tasks, require(outputer), nProcesses || 10, resultPath).analise().then(() => console.log('finished'));
    });

program
    .command('execNodeProcts <taskFile> <projectJsonFile> <resultPath> [processes] [outputer]')
    .alias('enp')
    .description('execute a node file agains the script')
    .action((taskFile, projectsFile, resultPath, nProcesses, outputer) => {
        const projects = require(projectsFile);
        outputer = outputer || '../output/jsonFile.js';
        new ProjectsAnaliser(projects, [require(taskFile).run], require(outputer), nProcesses || 10, resultPath).analise().then(() => console.log('finished'));
    });
program
    .command('server')
    .alias('s')
    .description('run the server and the we client app')
    .action(() => {
        util.execPromise(`cd ${__dirname}&&npm run server`);
        util.execPromise(`cd ${__dirname}&&npm run  client`);
    });
program.parse(process.argv);
