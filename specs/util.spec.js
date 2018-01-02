const sinon = require("sinon");
const expect = require('chai');
const util = require('../lib/util.js');
describe('logProcess', function() {
    it('should log the process start', function() {
        const mock = sinon.mock(util.getLogger());
        mock.expects("log").once();
        util.logProcess("test", "start", "some");
        mock.verify();
    });
    it('should not the process end', function() {
        const mock = sinon.mock(util.getLogger());
        mock.expects("log").never();
        util.logProcess("test", "end", "some");
        mock.verify();
    });
});
describe('startProcess', function() {
    it('should log the process start ', function() {
        const mock = sinon.mock(util.getLogger());
        mock.expects("log").once().withArgs("Starting", "[some]:test");
        util.logProcessStart("test", "some");
        mock.verify();
    });
});
describe('endProcess', function() {
    it('should log the process end ', function() {
        const mock = sinon.mock(util.getLogger());
        mock.expects("log").never();
        util.logProcessEnd("test", "some");
        mock.verify();
    });
});
describe('getProjectLogger', function() {
    it('shoud return a logger to the project', function() {
        const mock = sinon.mock(util.getLogger());
        mock.expects("log").withArgs("[SomeProject]:test");
        mock.expects("log").withArgs("Starting","[SomeProject]:test");
        util.getProjectLogger("SomeProject").log("test");
        util.getProjectLogger("SomeProject").start("test");
        util.getProjectLogger("SomeProject").end("test");
    });

});
