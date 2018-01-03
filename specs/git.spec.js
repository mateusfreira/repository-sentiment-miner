const _ = require("lodash");
const fs = require('fs');
const sinon = require('sinon');
const expect = require('chai').expect;
const util = require('../lib/util.js');
const git = require('../lib/git.js');
describe('git', function() {
    describe('moveToMaster', function() {
        it('should execute the command to move to master', function() {
            const mock = sinon.mock(util);
            mock.expects('execPromise').once().withArgs('cd  test/test&&git checkout master -f').callsFake(() => Promise.resolve());
            return git.moveToMaster('test', 'test').then(() => mock.verify());
        });
    });
    describe('clone', function() {
        it('should clone the repository', function() {
            const mock = sinon.mock(util);
            mock.expects('execPromise').once().withArgs('cd  /tmp/&&git clone git://test.test.git').callsFake(() => Promise.resolve());
            return git.clone('git://test.test.git', 'test', '/tmp/').then(() => mock.verify());
        });
        it('should move to master if the repository already exists', function() {
            const mock = sinon.mock(util);
            mock.expects('execPromise').once().withArgs('cd  /tmp&&git clone git://test.test.git')
                .callsFake(() => Promise.reject(new Error('Directory already exists')));

            mock.expects('execPromise').once().withArgs('cd  /tmp/test&&git checkout master -f').callsFake(() => Promise.resolve());

            return git.clone('git://test.test.git', 'test', '/tmp').then(() => mock.verify());
        });
    });
    describe('getCommitsAsJson', function() {
        it('should return the commits as a json', function() {
            const mock = sinon.mock(util);
            mock.expects('execPromise').once().callsFake(() => Promise.resolve(fs.readFileSync(`${__dirname}/fixtures/commits.fixture.txt`, "utf8")));
            return git.getCommitsAsJson('/tmp', 'test').then(commits => {
                expect(_.first(commits)).to.have.all.keys("commit", "abbreviated_commit", "tree", "abbreviated_tree", "parent", "abbreviated_parent", "refs", "encoding", "comment", "sanitized_subject_line", "verification_flag", "signer", "signer_key", "author", "commiter");
            });
        });

    })
});
