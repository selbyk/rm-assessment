/* globals describe: false, it: false, afterEach: false */
'use strict';
process.env.NODE_ENV = 'test';
const config = require('../config'); // jshint ignore:line

const _ = require('lodash');
const expect = require('chai').expect;
const chance = new require('chance')();

const db = require('../db');

describe('db', () => {
    describe('Mail model', () => {
        let createdIds = [];

        afterEach((done) => {
            // Remove any models that may have been created
            db.models.Mail
                .where('id', 'IN', createdIds)
                .destroy()
                .then(() => {
                    createdIds = [];
                    done();
                })
                .catch(done);
        });

        it('can be persisted', (done) => {
            const mail = {
                to: chance.email(),
                from: chance.email(),
                subject: chance.sentence(),
                inputHtml: chance.paragraph(),
                outputHtml: chance.paragraph()
            };
            db.models.Mail.forge(mail)
                .save()
                .then(function(row) {
                    createdIds.push(row.get('id'));
                    db.models.Mail.where({
                            id: row.get('id')
                        })
                        .fetch()
                        .then(function(row) {
                            expect(mail).to.deep.equal(_.omit(row.toJSON(), ['id', 'createdAt']));
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });
});
