const sinon = require("sinon");
const expect = require('chai').expect;
const PersistenceManager = new require('../model/index.js');
const persistenceManager = new PersistenceManager('/tmp')
describe('model', function() {
    it('should list all the projects project', async function() {
        await persistenceManager.addProject({
            url: 'test',
            name: 'test_project'
        });
        const projects = await persistenceManager.findProjectsName();
        expect(projects.filter(p => p.name === 'test_project').length).to.be.equal(1);
    });
    it('should save a project', function() {
        return persistenceManager.addProject({
            url: 'test',
            name: 'test_project'
        }).then(() => {
            return persistenceManager.getProject('test_project').then((p) => {
                expect(p.name).to.be.equal('test_project');
            })
        })
    });
});
