const { GitLabImporter } = require('../service/sentiment/GitLabImporter.js');

const should = require("should");
describe("GitLabImporter", function() {
    this.timeout(10000);
    const gitLab = new GitLabImporter();
    it("should return the project data", () => {//Skiped until we add nocks
        return gitLab.getProject("https://gitlab.com/mateusfreira/node-stackoverflow-jobs").then((r) => {
            r.name.should.be.equal("node-stackoverflow-jobs");
        });
    });

    it("should get all the PRs from a project", async ()=> {
        const project = await gitLab.getProject('https://gitlab.com/mateusfreira/node-stackoverflow-jobs');
        const pulls = await gitLab.getPulls(project);
        console.log(pulls);
        pulls.length.should.be.above(0);
    });

    it("should get all the commits from a project", async ()=> {
        const project = await gitLab.getProject('https://gitlab.com/mateusfreira/node-stackoverflow-jobs');
        const commits = await gitLab.getCommits(project);
        commits.length.should.be.above(0);
    });

    it("should get all the comments from a project", async ()=> {
        const project = await gitLab.getProject('https://gitlab.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await gitLab.getPulls(project);
        const [firstComment] = await gitLab.getPullComments(pull);
        firstComment.body.should.be.equal("thanks");
    });

    it("should get all the reviews from a pull", async ()=> {
        const project = await gitLagitLabroject('https://gitlab.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await gitLab.getPulls(project);
        pull.title.should.be.equal("Little error when you were typing your name");
        const [firstComment] = await gitLab.getPullReviews(pull);
        firstComment.body.should.be.equal("LGTM");
    });

    it("should get all the commits from a pull", async ()=> {
        const project = await gitLab.getProject('https://gitlab.com/mateusfreira/node-stackoverflow-jobs');
        const [pull] = await gitLab.getPulls(project);
        pull.title.should.be.equal("Little error when you were typing your name");
        const [firstCommit] = await gitLab.getPullCommits(pull);
        firstCommit.commit.message.should.be.equal("little error when typing your name");
    });
});
