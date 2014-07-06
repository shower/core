modules.define('util.dom', [], function (provide) {

    /**
     * @name util.dom
     * @static
     */
    var utilDom = {
        /**
         * @static
         * Find node by query.
         * @param {String} selector
         * @param {HTMLElement} [parentElement = document]
         * @returns {HTMLElement|Null}
         */
        find: function (selector, parentElement) {
            parentElement = parentElement || document;
            return parentElement.querySelector(selector);
        },

        /**
         * @static
         * Find all nodes by query.
         * @param {String} selector
         * @param {HTMLElement} [parentElement = document]
         * @returns {HTMLElement[]|Null}
         */
        findAll: function (selector, parentElement) {
            parentElement = parentElement || document;
            return parentElement.querySelectorAll(selector);
        },

        /**
         * @static
         * @param {String} elementId
         * @param {HTMLElement} [parentElement = document]
         * @returns {HTMLElement|Null}
         */
        findById: function (elementId, parentElement) {
            parentElement = parentElement || document;
            return parentElement.getElementById(elementId);
        },

        /**
         * @static
         * @param {Object|String} [options] Options or element tag name.
         * @param {String} [options.tag = 'div']
         * @param {String} [options.content]
         * @param {Object} [options.attrs]
         * @param {HTMLElement} [options.parentElement]
         * @returns {HTMLElement} Created element.
         */
        create: function (options) {
            var tagName = typeof options == 'string' ? options : (options && options.tag || 'div'),
                element = document.createElement(tagName);

            options = options || {};

            var attributes = options.attrs;
            if (attributes) {
                for (var attributeName in attributes) {
                    if (attributes.hasOwnProperty(attributeName)) {
                        element.setAttribute(attributeName, attributes[attributeName]);
                    }
                }
            }

            if (options.content) {
                element.innerHTML = options.content;
            }

            if (options.parentElement) {
                options.parentElement.appendChild(element);
            }

            return element;
        },

        /**
         * @static
         * @param {HTMLElement} node
         */
        remove: function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    };

    provide(utilDom);
});
