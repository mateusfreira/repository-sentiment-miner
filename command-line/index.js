const ProjectAnaliser = require('../service/projectAnaliser.js');
const program = require('commander');
program
    .version('0.0.1')
    .description('Commits miner helper');

program
    .command('lser <gitUrl> <resultPath> <projectName> [processes]')
    .alias('ls')
    .description('this is test command')
    .action((gitUrl, resultPath, projectName, nProcesses) => {
        new ProjectAnaliser(gitUrl, projectName, [require('../tasks/ls.js').run], nProcesses || 10, resultPath).analise().then(console.log);
    });
program.parse(process.argv);
