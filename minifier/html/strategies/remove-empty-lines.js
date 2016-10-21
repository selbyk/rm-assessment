'use strict';

/**
 * Tests whether an element isn't empty
 * @param  {object} element object to test
 * @return {bool}         true if element isn't empty
 */
function elementNotEmpty(element) {
    if (!element) {
        return false;
    }
    const type = typeof element;
    if (type === 'string' && /\n^\s*$/gm.test(element)) {
        return false;
    }
    if (type === 'array' && element.length === 0) {
        return false;
    }
    if (type === 'object' && element === {}) {
        return false;
    }
    return true;
}

module.exports = function() {
    return function parse(tree) {
        tree.match({
            tag: /.+/
        }, node => {
            if (Array.isArray(node.content)) {
                node.content = node.content.filter(elementNotEmpty);
            }
            return node;
        });

        return tree;
    };
};
