'use strict';

/**
 * Next shortest unique string in format /([A-Z]|[a-z])+/
 * @param  {String} last used to generate next shortest string
 * @return {String}                  next shortest unique string
 */
function nextName(last) {
    last = last || '@';
    let code = last.charCodeAt(last.length - 1);
    if (code === 122) {
        last += 'A';
    } else {
        if (code === 90) {
            code = 96;
        }
        last = last.replace(/.$/, '') + String.fromCharCode(code + 1);
    }
    return last;
}

module.exports = function() {
    return function parse(tree) {
        // Map original strings to replacement strings
        let idMap = {};
        let classNameMap = {};

        // Next shortest string
        let currentIdRename = nextName();
        let currentClassRename = nextName();

        // For each tree node that has an id attribute:
        //  Create mapping if one doesn't already exist
        //  in idMap and then replace the id with it
        tree.match({
            attrs: {
                id: /.+/
            }
        }, node => {
            if (idMap[node.attrs.id]) {
                node.attrs.id = idMap[node.attrs.id];
            } else {
                idMap[node.attrs.id] = currentIdRename;
                node.attrs.id = currentIdRename;
                currentIdRename = nextName(currentIdRename);
            }
            return node;
        });

        // For each tree node that has class attribute:
        //  Create mapping if one doesn't already exist
        //  in classNameMap and then replace the class name(s)
        //  with it
        tree.match({
            attrs: {
                class: /.+/
            }
        }, node => {
            // Break class attr into its classes
            let classes = node.attrs.class.split(/\s+/g);
            // Build new classAttr
            let classAttr = '';
            for (let i = 0; i < classes.length; ++i) {
                if (classNameMap[classes[i]]) {
                    classAttr = classAttr === '' ? classNameMap[classes[i]] : classAttr + ' ' + classNameMap[classes[i]];
                } else {
                    classNameMap[classes[i]] = currentClassRename;
                    classAttr = classAttr === '' ? currentClassRename : classAttr + ' ' + currentClassRename;
                    currentClassRename = nextName(currentClassRename);
                }
            }
            node.attrs.class = classAttr;
            return node;
        });

        // Replace ids and classnames in style elements
        tree.match({
            tag: 'style'
        }, node => {
            node.content = node.content.map(styles => { // jshint ignore:line
                // Replace ids
                for (let id in idMap) {
                    const regex = new RegExp('#' + id);
                    styles = styles.replace(regex, '#' + idMap[id]);
                }
                // Replace class names
                for (let className in classNameMap) {
                    const regex = new RegExp('\.' + className);
                    styles = styles.replace(regex, '.' + classNameMap[className]);
                }
                return styles;
            });
            return node;
        });

        return tree;
    };
};
