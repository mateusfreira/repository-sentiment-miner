const Promise = require('bluebird');
const _ = require('lodash');
const sinon = require("sinon");
const expect = require('chai').expect;
const ProjectAnaliser = require('../service/projectAnaliser.js');
const util = require('../lib/util.js');
const git = require('../lib/git.js');
describe('ProjectAnaliser', function() {
    describe('runTaskForEachCommit', function() {
        it('should run the tasks for each commit', function() {
            const tasks = [
                (projectName, path, util, logger, a, c) => {
                    a.a = 1;
                    c();
                },
                (projectName, path, util, logger, b, c) => {
                    b.b = 1;
                    c();
                },
                (projectName, path, util, logger, c, callback) => {
                    setTimeout(() => {
                        c.c = 1;
                        callback();
                    }, 10);
                }
            ];
            const outputer = {
                export: () => {}
            };
            sinon.stub(outputer, 'export').callsFake((projectName, path, commits, util, logger, cb) => cb());
            const commits = [{
                commit: "982137897d897123df"
            }];
            const mock = sinon.mock(util);
            mock.expects('execPromise').once().withArgs(sinon.match(/git log/)).callsFake(() => Promise.resolve('{  $$-$$commit$$-$$##$## $$-$$982137897d897123df$$-$$}'));
            mock.expects('execPromise').once().withArgs('cd  /tmp&&git clone git://test.git').callsFake(() => Promise.resolve());
            mock.expects('execPromise').once().withArgs('rm -Rf /tmp/test_commits&&mkdir /tmp/test_commits').callsFake(() => Promise.resolve());
            mock.expects('execPromise').once().withArgs('rm -Rf /tmp/test_commits/982137897d897123df&&mkdir /tmp/test_commits/982137897d897123df').callsFake(() => Promise.resolve());
            mock.expects('execPromise').once().withArgs('cd  /tmp/test&&git --work-tree=/tmp/test_commits/982137897d897123df checkout 982137897d897123df -- .').callsFake(() => Promise.resolve());
            mock.expects('execPromise').once().withArgs('rm -Rf /tmp/test_commits/982137897d897123df').callsFake(() => Promise.resolve());
            return new ProjectAnaliser('git://test.git', 'test', tasks, outputer, 1, '/tmp', commits).analise().then(o => {
                expect(outputer.export.calledWith('test', '/tmp', sinon.match.array, sinon.match.any)).to.be.equal(true);
                expect(_.first(o)).to.have.all.keys('a', 'b', 'c', 'commit');
            });
        });
    });
});
