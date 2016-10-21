// Update with your config settings.
const config = require('./config');

module.exports = {
    development: config.db,
    staging: config.db,
    production: config.db
};
