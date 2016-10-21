'use strict';
const config = require('../config');

const knex = require('knex')(config.db);
const bookshelf = require('bookshelf')(knex);

const Mail = bookshelf.Model.extend({
    tableName: 'mail'
});

bookshelf.models = {
    Mail
};

module.exports = bookshelf;
