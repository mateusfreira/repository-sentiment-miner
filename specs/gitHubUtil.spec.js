const gitHubUtil = require("../lib/gitHubUtil.js");
const should = require("should");
const nock = require('nock');
describe("gitHubUtil", () => {
    before(() => {
        [0, 1, 2, 3].forEach((i) => {
            require(`./fixtures/gh-fixture-${i}.js`)(nock);
        })
    });
    it("return the data from a simple resource", () => {
        return gitHubUtil.getData("https://api.github.com/users/mateusfreira", tokens = []).then((r) => {
            r.login.should.be.equal("mateusfreira");
        });
    });
    it("should return dependety data when required", () => {
        return gitHubUtil.getData("https://api.github.com/users/mateusfreira", null, ["followers_url", "following_url"]).then((r) => {
            r.login.should.be.equal("mateusfreira");
            r._following.length.should.be.above(10);
            r._followers.length.should.be.above(10);
        });
    })
});
