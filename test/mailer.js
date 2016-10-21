/* globals describe: false, it: false */
'use strict';
const _ = require('lodash');
const expect = require('chai').expect;
const chance = new require('chance')();

const config = require('../config');
const mailer = require('../mailer');

describe('mailer', () => {
    it('can send mail', (done) => {
        const mail = {
            to: chance.email(),
            from: chance.email(),
            subject: chance.sentence(),
            html: chance.paragraph()
        };

        mailer.sendMail(mail, (error, info) => { // jshint ignore:line
            if (error) {
                return done(error);
            }
            let inOutbox = false;
            for (let sent of config.nodemailer.transport.sentMail) {
                if (_.isEqual(mail, sent.data)) {
                    inOutbox = true;
                    break;
                }
            }
            expect(inOutbox, 'email exists in outbox').to.equal(true);
            done();
        });
    });
});
