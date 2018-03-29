const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('config');
mongoose.Promise = Promise;
console.log(config.get('mongo.url'));
module.exports.connectPromise = mongoose.connect(config.get('mongo.url'), config.get('mongo.opt'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log("connection to db open");
});
module.exports.Project = mongoose.model('Project', mongoose.Schema({}, {
    strict: false
}));
module.exports.Issue = mongoose.model('Issue', mongoose.Schema({}, {
    strict: false
}));
module.exports.IssueComments = mongoose.model('IssueComments', mongoose.Schema({}, {
    strict: false
}));
module.exports.Pull = mongoose.model('Pull', mongoose.Schema({}, {
    strict: false
}));
module.exports.PullComments = mongoose.model('PullComments', mongoose.Schema({}, {
    strict: false
}));
module.exports.PullReviews = mongoose.model('PullReviews', mongoose.Schema({}, {
    strict: false
}));

module.exports.Commit = mongoose.model('Commit', mongoose.Schema({}, {
    strict: false
}));

module.exports.Developer = mongoose.model('Developer', mongoose.Schema({}, {
    strict: false
}));
