'use strict';
const config = require('../config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport(config.nodemailer.transport);

// Import our minifier
const db = require('../db');
// Import our minifier
const minifier = require('../minifier');

// Create a server with a host and port
const server = express();

// Configure server
server.use(bodyParser.json()); // for parsing application/json

function errorHandler(err, req, res) {
    return res.status(500).json({
        status: 'error',
        message: err.message || err
    });
}

// Setup our routes
server.get('/', function(req, res) {
    res.json({
        status: 'success',
        message: 'Hello World!'
    });
});

server.post('/', function(req, res, next) {
    const requiredKeys = ['to', 'from', 'subject', 'html'];
    if (!req.body) {
        return next('Request body is missing');
    } else {
        const missingKeys = _.difference(requiredKeys, Object.keys(req.body));
        if (missingKeys.length > 0) {
            return next(`Request body is missing the required keys: ${missingKeys.join(',')}.`);
        }
    }

    const opts = {
        optimizeClassNames: true
    };

    minifier(req.body.html, opts)
        .then(minifiedHtml => {
            const mail = {
                to: req.body.to,
                from: req.body.from,
                subject: req.body.subject,
                html: minifiedHtml,
            };
            mailTransporter.sendMail(mail, err => {
                if (err) {
                    console.log('not here');
                    return next(err);
                }
                db.models.Mail
                    .forge({
                        to: mail.to,
                        from: mail.from,
                        subject: mail.subject,
                        inputHtml: req.body.html,
                        outputHtml: mail.html
                    })
                    .save()
                    .then(() => {
                        return res.json({
                            status: 'success',
                            message: 'Mail sent successfully.'
                        });
                    })
                    .catch(next);
            });
        })
        .catch(next);
});

server.use(errorHandler);

module.exports = server;
