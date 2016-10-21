'use strict';
const _ = require('lodash');
const htmlMinifer = require('./html');

const defaultOpts = {
    optimizeClassNames: false,
    removeUnusedClasses: false,
    useShortHex: false
};

module.exports = function minifier(html, opts) {
    opts = opts || {};
    _.defaults(opts, defaultOpts);
    return new Promise((resolve, reject) => {
        htmlMinifer(html, opts)
            .then(result => resolve(result.html))
            .catch(reject);
    });
};
