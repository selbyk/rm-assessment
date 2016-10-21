'use strict';

function elementNotEmpty(element) {
    const type = typeof element;
    if (type === 'undefined') {
        return false;
    }
    if (type === 'string' && /\n^\s*$/gm.test(element)) {
        return false;
    }
    return true;
}

module.exports = function() {
    return function parse(tree) {
        tree.match({
            tag: 'html'
        }, function(node) {
            node.content = node.content.filter(elementNotEmpty); //replace(/^\s*\n/gm, '');
            node.content.map(element => {
                const type = typeof element;
                if (type === 'object' && element.content) {
                    element.content = element.content.filter(elementNotEmpty);
                }
                return element;
            });
            return node;
        });

        tree.match({
            tag: 'style'
        }, function(node) {
            node.content = node.content.filter(elementNotEmpty); //replace(/^\s*\n/gm, '');
            node.content.map(element => {
                const type = typeof element;
                if (type === 'object' && element.content) {
                    element.content = element.content.filter(elementNotEmpty);
                }
                return element;
            });

            return node;
        });

        return tree;
    };
};
