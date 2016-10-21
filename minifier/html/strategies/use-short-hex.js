'use strict';
module.exports = function() {
    return function parse(tree) {
        // Replace hex with shorthand, if applicable
        tree.match({
            tag: 'style'
        }, function(node) {
            node.content = node.content.map(style => {
                return style.replace(/#(.)\1(.)\2(.)\3/g, '#$1$2$3');
            });
            return node;
        });
        return tree;
    };
};
