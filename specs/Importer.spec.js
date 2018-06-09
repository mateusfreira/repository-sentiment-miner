const { GitHubImporter } = require('../service/sentiment/GitHubImporter.js');
const { GitLabImporter } = require('../service/sentiment/GitLabImporter.js');
const { Importer } = require('../service/sentiment/Importer.js');

const should = require("should");
describe("Importer", function() {
    it("Should return gitHub for github urls", () => { //Skiped until we add nocks
        const gitHub = Importer.importerFactory("https://github.com/mateusfreira/any");
        gitHub.should.be.an.instanceof(GitHubImporter);
    });

    it("Should return gitLab for gitlab urls", () => { //Skiped until we add nocks
        const gitHub = Importer.importerFactory("https://gitlab.com/mateusfreira/any");
        gitHub.should.be.an.instanceof(GitLabImporter);
    });

});
