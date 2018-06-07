const { GitHubImporter  } = require('./GitHubImporter.js');
const { GitLabImporter  } = require('./GitLabImporter.js');
const importerMap = {
    "github.com": GitHubImporter,
    "gitlab.com": GitLabImporter
};

class Importer {
    static importerFactory(url) {
        const domain = url.split(`/`)[2] || 'github.com';
        const importer = importerMap[domain];
        return new importer();
    }

}
module.exports.Importer = Importer;
