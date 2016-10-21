'use strict';

function nextName(currentClassName) {
    currentClassName = currentClassName || '@';
    let code = currentClassName.charCodeAt(currentClassName.length - 1);
    if (code === 122) {
        currentClassName += 'A';
    } else {
        if (code === 90) {
            code = 96;
        }
        currentClassName = currentClassName.replace(/.$/, '') + String.fromCharCode(code + 1);
    }
    return currentClassName;
}

module.exports = function() {
    return function parse(tree) {
        let classNameMap = {};

        let currentClassRename = nextName();

        tree.match({
            tag: 'body'
        }, function(node) {
            node.content.forEach(element => {
                if (typeof element === 'object') {
                    if (element.attrs.class) {
                        let classes = element.attrs.class.split(/\s+/g);
                        let eleClassAttr = '';
                        for (let i = 0; i < classes.length; ++i) {
                            if (classNameMap[classes[i]]) {
                                eleClassAttr = eleClassAttr === '' ? classNameMap[classes[i]] : eleClassAttr + ' ' + classNameMap[classes[i]];
                            } else {
                                classNameMap[classes[i]] = currentClassRename;
                                eleClassAttr = eleClassAttr === '' ? currentClassRename : eleClassAttr + ' ' + currentClassRename;
                                currentClassRename = nextName(currentClassRename);
                            }
                        }
                        element.attrs.class = eleClassAttr;
                    }
                }
            });
            return node;
        });

        tree.match({
            tag: 'style'
        }, function(node) {
            let classNames = Object.keys(classNameMap);
            for (let i = 0; i < classNames.length; ++i) {
                node.content = node.content.map(styles => { // jshint ignore:line
                    const regex = new RegExp('\.' + classNames[i]);
                    return styles.replace(regex, '.' + classNameMap[classNames[i]]);
                });
            }
            return node;
        });

        return tree;
    };
};
