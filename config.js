'use strict';

let config = {
    port: 3434,
    logLevel: 'error',
    nodemailer: {
        transport: require('nodemailer-mock-transport')()
    },
    db: {
        client: 'sqlite3',
        connection: {
            filename: 'test.sqlite3'
        }
    }
};

if (process.env.NODE_ENV === 'test') {
    config.nodemailer.transport = require('nodemailer-mock-transport')();
    config.db = {
        client: 'sqlite3',
        connection: {
            filename: 'test.sqlite3'
        }
    };
}

module.exports = config;
