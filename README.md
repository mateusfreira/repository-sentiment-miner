# Repository Sentiment Miner

Repository Sentiment Miner is a tool for extracting sentiment from GitHub repositories
[![Build Status](https://travis-ci.org/mateusfreira/repository-sentiment-miner.svg?branch=master)](https://travis-ci.org/mateusfreira/repository-sentiment-miner)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/commits-miner/Lobby)
# What does it do
Sentiment repository miner all the complexity of processing repositories information dealing with all the Github API interactions and provides a high-level API to implement sentiment analysis tools on each interaction.

<img width="1680" alt="screen shot 2018-06-03 at 08 21 24" src="https://user-images.githubusercontent.com/234049/40886033-4344fc78-6707-11e8-8a9d-b5dedd5e7b1e.png">



* ## Paralelous
* You can decide how many processes  run at the same time

* ## Easy to integrate
* Create your tasks in minutes to process the repository interaction(Pull, Pull Comments and Commits) in Node.js
```javascript
/**
  * Receive the messages and return a promise with the result
  * @return Promise
  */
exports.run = (messages) => {
        return Promise();
}
```

# Instalation
For now ping us on the chat [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/commits-miner/Lobby)

Doker image comming soon :) 
<!---
## Requirements
* Node.js > 8 https://nodejs.org/en/
## From NPM
* Install `npm install commit-miner`
* Run `commit-miner s`
## From source code
* Clone the repository
* Create a './config/default.json' using `./config/production-sample.json` as a example
* run `npm i`
* run `npm run server` (To start the server)
    * run `npm run client` (To start the web client)
-->
## Available tasks

* Sentistrength (http://sentistrength.wlv.ac.uk/) https://github.com/mateusfreira/senti-strength-node (Native)
* AFINN-based sentiment https://github.com/thisandagain/sentiment (Native)


# Needs help? 
Ping me on chat [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/commits-miner/Lobby)



