const {
    GitHubImporter
} = require('../service/sentiment/GitHubImporter.js');

const should = require("should");
//const nock = require('nock');
describe("GitHubImporter", () => {
    const github = new GitHubImporter();
    /*    before(() => {
            [0, 1, 2, 3].forEach((i) => {
                require(`./fixtures/gh-fixture-${i}.js`)(nock);
            })
        });
    */
    it.skip("should return the project data", () => {//Skiped until we add nocks
        return github.getProject("https://github.com/mateusfreira/dotfiles").then((r) => {
            r.name.should.be.equal("dotfiles");
        });
    });
});
