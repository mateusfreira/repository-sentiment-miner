# Commits Miner
Commits miner is a tool to process and extract useful information from commits history in git repositories.
[![Build Status](https://travis-ci.org/mateusfreira/commits-miner.svg?branch=master)](https://travis-ci.org/mateusfreira/commits-miner) [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/commits-miner/Lobby)
# What does it do
Commits Miner manager all the complexity of processing commits history preparing the directories with the code at the time of commit you want to process and managing all the tasks processing the commit as well as clearing the environment after processing the information
* ## Paralelous
* You can decide how many processes will run at the same time

* ## Easy to integrate
* Create your tasks in minutes to process the commit in Node.js
```javascript
/**
* This command executes one find in the directory of the project and storage the results on the commit object.
*/
exports.run = (projectName, path, util, logger, commit, cb) => {
  util.execPromise(`cd ${path}&&find .`).then(r => {
    commit.ls = r;
    cb(); 
  });
}
```
* ### Language agnostic
* Or in any other language, you only need to provide an executable ready to receive the following parameter
```bath
your-command project_name commit_dir commit_info_in_json
```
  * If you command return a json it will be parsed and attached to the commit object. If not the result is attached as text on the commit object (check https://github.com/mateusfreira/ck/blob/master/src/main/java/com/github/mauricioaniche/ck/Runner.java) for a simple example of Java



# Instalation
## Requirements
* Node.js > 8 https://nodejs.org/en/
## From NPM
* Install `npm install commit-miner`
* Run `commit-miner s`
## From source code
* Clone the repository
* run `npm i`
* run `npm run server` (To start the server)
* run `npm run client` (To start the web client)

## Avaliable tasks

* Java CK metrics https://github.com/mateusfreira/ck
* Pmd java designs Violations https://github.com/mateusfreira/pmd-java-design-commits-miner-task
* Internals
  * Node.js test seep `./tasks/node-test-speed.js` Calulates the test speed over the project time
  * List files `./tasks/ls.js`

# Needs help? 
Ping me on chat [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/commits-miner/Lobby)






