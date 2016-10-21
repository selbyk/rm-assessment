/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
process.env.NODE_ENV = 'test';
const config = require('../config');

const _ = require('lodash');
const request = require('supertest');
const expect = require('chai').expect;
const chance = new require('chance')();

const server = require('../server');

describe('server', () => {
    let serverListener;

    beforeEach((done) => {
        serverListener = server.listen(config.port, done);
    });

    afterEach((done) => {
        serverListener.close(done);
    });

    describe('GET /', () => {
        it('says hello', (done) => {
            request(serverListener)
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    expect(res.body.status).to.equal('success');
                    expect(res.body.message).to.equal('Hello World!');
                })
                .expect(200, done);
        });
    });

    describe('POST /', () => {
        it('sends email with optimized HTML to recipient', (done) => {
            const mail = {
                to: chance.email(),
                from: chance.email(),
                subject: chance.sentence(),
                html: chance.paragraph()
            };
            request(serverListener)
                .post('/')
                .send(mail)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    expect(res.body.status, res.body.message).to.equal('success');
                })
                .expect(() => {
                    let inOutbox = false;
                    for (let sent of config.nodemailer.transport.sentMail) {
                        if (_.isEqual(mail, _.omit(sent.data, ['headers']))) {
                            inOutbox = true;
                            break;
                        }
                    }
                    expect(inOutbox, 'email exists in outbox').to.equal(true);
                })
                .expect(200, done);
        });
    });
});
