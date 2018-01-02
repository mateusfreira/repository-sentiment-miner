const sinon = require("sinon");
const expect = require('chai');
const util = require('../lib/util.js');
const git = require("../lib/git.js");
describe('moveToMaster', function() {
    it('should execute the command to move to master', function() {
        const mock = sinon.mock(util);
        mock.expects("execPromise").once().withArgs("cd  test/test&&git checkout master -f").callsFake(() => Promise.resolve());
        return git.moveToMaster("test", "test").then(() => mock.verify());
    });
});
describe('clone', function() {
    it('shuld clone the repository', function() {
        const mock = sinon.mock(util);
        mock.expects("execPromise").once().withArgs("cd  /tmp/&&git clone git://test.test.git").callsFake(() => Promise.resolve());
        return git.clone("git://test.test.git", "test", "/tmp/").then(() => mock.verify());
    });
});
