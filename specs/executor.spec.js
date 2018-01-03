const _ = require('lodash');
const sinon = require("sinon");
const expect = require('chai').expect;
const Executor = require('../executor');
describe('Executor', function() {
    describe('execTasks', function() {
        it('should execute all tasks for one  objects', function() {
            const tasks = [
                (a, c) => {
                    a.a = 1;
                    c();
                },
                (b, c) => {
                    b.b = 1;
                    c();
                },
                (c, callback) => {
                    setTimeout(() => {
                        c.c = 1;
                        callback();
                    }, 10);
                }
            ];
            return new Executor().executeTasks(tasks, {}).then(o => {
                expect(o).to.have.all.keys('a', 'b', 'c')
            })
        });

        it('should execute all tasks for all objects in serie', function() {
            const tasks = [
                (a, c) => {
                    a.a = 1;
                    c();
                },
                (b, c) => {
                    b.b = 1;
                    expect(b).to.have.all.keys('a', 'b');
                    expect(b).not.to.have.keys('c');
                    c();
                },
                (c, callback) => {
                    setTimeout(() => {
                        c.c = 1;
                        expect(c).to.have.all.keys('a', 'b', 'c');
                        callback();
                    }, 10);
                }
            ];
            return new Executor().executeAllTasks(tasks, [{}, {}]).then(o => {
                expect(_.first(o)).to.have.all.keys('a', 'b', 'c');
                expect(_.last(o)).to.have.all.keys('a', 'b', 'c');
            })
        });

    });
});
