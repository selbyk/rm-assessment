'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config');
const minifier = require('../minifier');
const mailer = require('../mailer');
const db = require('../db');

// Create and configure our exoress server
const server = express();
server.use(bodyParser.json()); // for parsing application/json

/**
 * Express error handler that responses with an error message
 * @param  {Error} err an error
 * @param  {Request} req Express Request object
 * @param  {Response} res Express Response object
 */
function errorHandler(err, req, res) {
    res.status(500).json({
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

    minifier(req.body.html, config.minifyStrategies)
        .then(minifiedHtml => {
            const mail = {
                to: req.body.to,
                from: req.body.from,
                subject: req.body.subject,
                html: minifiedHtml,
            };
            mailer.sendMail(mail, err => {
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
