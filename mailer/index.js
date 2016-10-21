'use strict';
const nodemailer = require('nodemailer');
const config = require('../config');

// Create our mailer
const mailer = nodemailer.createTransport(config.nodemailer.transport);

module.exports = mailer;
