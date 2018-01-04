const ProjectAnaliser = require('../service/projectAnaliser.js');
const program = require('commander');
program
    .version('0.0.1')
    .description('Commits miner helper');
program
    .command('lser <gitUrl> <resultPath> <projectName>')
    .alias('ls')
    .description('this is test command')
    .action((gitUrl, resultPath, projectName) => {
        new ProjectAnaliser().analise(gitUrl, projectName, [require('../tasks/ls.js').run], 1, resultPath).then(console.log);
    });
program.parse(process.argv);
