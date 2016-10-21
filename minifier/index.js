'use strict';
const htmlMinifer = require('./html');

const defaultOpts = {
    optimizeClassNames: false
};

module.exports = function minifier(html, opts) {
    opts = opts || defaultOpts;
    return new Promise((resolve, reject) => {
        htmlMinifer(html, opts)
            .then(result => resolve(result.html))
            .catch(err => reject(err));
    });
};
