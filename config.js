'use strict';
console.log(`Using config environment '${process.env.NODE_ENV}'`);

let config = {
    port: 3434,
    logLevel: 'error',
    nodemailer: null,
    db: null,
    minifyStrategies: {
        optimizeClassNames: true,
        removeUnusedClasses: true,
        useShortHex: true
    }
};

if (process.env.NODE_ENV === 'test') {
    config.nodemailer = {
        transport: require('nodemailer-mock-transport')()
    };
    config.db = {
        client: 'sqlite3',
        connection: {
            filename: 'test.sqlite3'
        }
    };
}

if (process.env.NODE_ENV === 'production') {
    config.nodemailer = {
        transport: require('nodemailer-mock-transport')()
    };
    config.db = {
        client: 'sqlite3',
        connection: {
            filename: 'test.sqlite3'
        }
    };
}

if (!config.nodemailer) {
    console.log('No nodemailer config, falling back to testing default.');
    config.nodemailer = {
        transport: require('nodemailer-mock-transport')()
    };
}

if (!config.db) {
    console.log('No db config, falling back to testing default.');
    config.db = {
        client: 'sqlite3',
        connection: {
            filename: 'test.sqlite3'
        }
    };
}

if (!config.minifyStrategies) {
    console.log('No minifyStrategies config, falling back to testing default.');
    config.minifyStrategies = {
        optimizeClassNames: true,
        removeUnusedClasses: true,
        useShortHex: true
    };
}

module.exports = config;
