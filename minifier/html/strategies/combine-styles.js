'use strict';

module.exports = function() {
    return function parse(tree) {
        let styles = [];

        tree.match({
            tag: 'style'
        }, node => {
            styles = styles.concat(node.content.map(sty => sty.replace(/\n^\s*/gm, '')));
        });

        tree.match({
            tag: 'head'
        }, node => {
            var element = {
                tag: 'style',
                content: styles
            };

            if (node.content) {
                node.content.push(element);
            } else {
                node.content = element;
            }

            return node;
        });

        return tree;
    };
};
