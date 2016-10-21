'use strict';

const css = require('css');

module.exports = function() {
    return function parse(tree) {
        let styledClasses = [];
        let elementClasses = [];

        // Add all class names used on elements to elementClasses
        tree.match({
            attrs: {
                class: /.+/
            }
        }, (node) => {
            let classes = node.attrs.class.split(/\s+/g);
            for (let className of classes) {
                if (elementClasses.indexOf(className) === -1) {
                    elementClasses.push(className);
                }
            }
            return node;
        });

        // Remove all class selectors that aren't used on elements
        // add the others to styledClasses
        tree.match({
            tag: 'style'
        }, (node) => {
            node.content = node.content.map((style) => {
                let obj = css.parse(style);
                for (let rule of obj.stylesheet.rules) {
                    rule.selectors = rule.selectors.filter((selector) => { // jshint ignore:line
                        if (selector.length > 0 && selector.charAt(0) === '.') {
                            let className = selector.substr(1);
                            if (elementClasses.indexOf(className) === -1) {
                                return false;
                            } else if (styledClasses.indexOf(className) === -1) {
                                styledClasses.push(className);
                            }
                        }
                        return true;
                    });
                }
                obj.stylesheet.rules = obj.stylesheet.rules.filter((rule) => {
                    if (rule.selectors.length === 0) {
                        return false;
                    }
                    return true;
                });
                return css.stringify(obj, {
                    compress: true
                });

            });

            node.content = node.content.filter(style => {
                return style !== '';
            });

            if (node.content.length > 0) {
                return node;
            }
        });

        // Remove all classes on elements that aren't in styledClasses
        tree.match({
            attrs: {
                class: /.+/
            }
        }, (node) => {
            let classes = node.attrs.class.split(/\s+/g);
            classes = classes.filter(className => {
                return styledClasses.indexOf(className) !== -1;
            });
            if (classes.length > 0) {
                node.attrs.class = classes.join(' ');
            } else {
                delete node.attrs.class;
            }

            return node;
        });

        return tree;
    };
};
