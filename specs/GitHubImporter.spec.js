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
    it("should return the project data", () => {//Skiped until we add nocks
        return github.getProject("https://github.com/mateusfreira/dotfiles").then((r) => {
            r.name.should.be.equal("dotfiles");
        });
    });

    it("should get all the PRs from a project", async ()=> {
        const project = await github.getProject('https://github.com/mateusfreira/node-stackoverflow-jobs');
        const pulls = await github.getPulls(project);
        pulls.length.should.be.above(0);
    });

    it("should get all the commits from a project", async ()=> {
        const project = await github.getProject('https://github.com/mateusfreira/node-stackoverflow-jobs');
        const commits = await github.getCommits(project);
        commits.length.should.be.above(0);
    });

    it("should get all the comments from a project", async ()=> {
        const project = await github.getProject('https://github.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await github.getPulls(project);
        pull.title.should.be.equal("Little error when you were typing your name");
        const [firstComment] = await github.getPullComments(pull);
        firstComment.body.should.be.equal("thanks");
    });

    it("should get all the reviews from a pull", async ()=> {
        const project = await github.getProject('https://github.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await github.getPulls(project);
        pull.title.should.be.equal("Little error when you were typing your name");
        const [firstComment] = await github.getPullReviews(pull);
        firstComment.body.should.be.equal("LGTM");
    });

    it("should get all the commits from a pull", async ()=> {
        const project = await github.getProject('https://github.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await github.getPulls(project);
        pull.title.should.be.equal("Little error when you were typing your name");
        const [firstCommit] = await github.getPullCommits(pull);
        firstCommit.commit.message.should.be.equal("little error when typing your name");
    });
});
