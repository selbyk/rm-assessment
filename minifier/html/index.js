'use strict';
const _ = require('lodash');
const posthtml = require('posthtml');

const collectStyles = require('./strategies/combine-styles')();
const removeEmptyLines = require('./strategies/remove-empty-lines')();
const optimizeClassNames = require('./strategies/optimize-css-identifiers')();
const removeUnusedClasses = require('./strategies/remove-unused-classes')();
const useShortHex = require('./strategies/use-short-hex')();

const defaultOpts = {
    optimizeClassNames: false,
    removeUnusedClasses: false,
    useShortHex: false
};

module.exports = function htmlMinifier(html, opts) {
    opts = opts || {};
    _.defaults(opts, defaultOpts);

    let strategies = [
        collectStyles
    ];

    if (opts.optimizeClassNames) {
        strategies.push(optimizeClassNames);
    }

    if (opts.removeUnusedClasses) {
        strategies.push(removeUnusedClasses);
    }

    if (opts.useShortHex) {
        strategies.push(useShortHex);
    }

    strategies.push(removeEmptyLines);

    return new Promise((resolve, reject) => {
        posthtml(strategies)
            .process(html /*, { sync: true }*/ )
            .then(minifiedHtml => resolve(minifiedHtml))
            .catch(err => reject(err));
    });
};
