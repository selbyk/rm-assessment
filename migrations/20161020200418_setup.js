'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('mail', function(table) {
        table.increments('id').primary();
        table.string('to').index();
        table.string('from').index();
        table.string('subject');
        table.text('inputHtml');
        table.text('outputHtml');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('mail');
};
