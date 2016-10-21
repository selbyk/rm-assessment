/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;

const config = require('../config');
const nodemailer = require('nodemailer');

describe('mailer', () => {
    beforeEach((done) => {
        done();
    });

    afterEach((done) => {
        done();
    });

    it('can send mail', (done) => {
        const transporter = nodemailer.createTransport(config.nodemailer.transport);

        transporter.sendMail({
            from: 'sender@address',
            to: 'ay@ud.org',
            subject: 'hello',
            text: 'hello world!'
        }, (error, info) => { // jshint ignore:line
            if (error) {
                return done(error);
            }
            expect(config.nodemailer.transport.sentMail.length).to.equal(1);
            done();
        });
    });
});
