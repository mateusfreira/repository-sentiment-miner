# Commits Miner
Commits Miner is a tool to extract information in commits history from git repositories and extract usefull information from the commits history.

# What does it do
Commits Miner manager all the complexty of processing commits history preparing the directories with the code at the time of commit you want to process and managing all the tasks processing the commit as well as clearing the enviroment after processing the iformation
* ## Paralelous
* You can decide how many processes will run at the same time
* It creates the folder witht the source code
* ## Easy to integrate
* Create your own tasks in minutes to process the commit in Node.js
```javascript
/**
* This command executes one find on the directory of the project and storage the results on the commit object.
*/
exports.run = (projectName, path, util, logger, commit, cb) => {
  util.execPromise(`cd ${path}&&find .`).then(r => {
    commit.ls = r;
    cb(); 
  });
}
```
* ### Language agnostic
* In any other language you only need to provide an executable ready to recive the followinf parameter
```bath
your-comman project_name commit_dir commit_info_in_json
```
* If you command return a json it will be parsed and atached to the commit object if not the result will be attached as text on the commit object (check https://github.com/mateusfreira/ck/blob/master/src/main/java/com/github/mauricioaniche/ck/Runner.java) for a simple example of Java


# Instalation
## From NPM
* Install `npm install commit-miner`
* Run `commit-miner s`
## From source code
* Clone the repository
* run `npm i`
* run `npm run prepare`
* run `npm run server` (To start the server)
* run `npm run client` (To start the web client)
