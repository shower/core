/**
 * @fileOverview
 * Slide layout.
 */
modules.define('slide.Layout', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    /**
     * Slide layout.
     * @name slide.Layout
     * @param {HTMLElement} element Slide node.
     */
    function Layout (element) {
        this.events = new EventEmitter();

        this._parentElement = null;
        this._element = element;

        this.init();
    }

    extend(Layout.prototype, /** @lends slide.Layout.prototype */ {
        /**
         * @ignore
         * Init layout.
         */
        init: function () {
            var parentNode = this._element.parentNode;
            if (!parentNode) {
                this.setParentElement(parentNode);
            } else {
                this._parentElement = parentNode;
            }
        },

        build: function () {

        },

        clear: function () {
            this.setParentElement(null);
        },

        // TODO: ?
        rebuild: function () {
            this.clear();
            this.build();
        },

        /**
         * @param {HTMLElement} parentElement
         */
        setParentElement: function (parentElement) {
            if (parentElement != this._parentElement) {
                this._parentElement = parentElement;
                parentElement.appendChild(this._element);

                this.events.fire('parentchange', {
                    parentElement: parentElement
                });
            }
        },

        /**
         * @returns {HTMLElement} Layout parent element.
         */
        getParentElement: function () {
            return this._parentElement;
        },

        /**
         * @returns {HTMLElement} Layout element.
         */
        getElement: function () {
            return this._element;
        }
    });

    provide(Layout);
});
