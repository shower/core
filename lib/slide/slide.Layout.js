/**
 * @fileOverview
 * Slide layout.
 */
modules.define('slide.Layout', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    var cssClasses = {
        active: 'active'
    };

    /**
     * Slide layout.
     * @name slide.Layout
     * @param {HTMLElement} element Slide node.
     */
    function Layout (element) {
        this.events = new EventEmitter();
        this._element = element;

        this._parent = null;
        this._parentElement = null;

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

        rebuild: function () {
            this.clear();
            this.build();
        },

        setParent: function (parent) {
            if (this._parent != parent) {
                this._clearListeners();

                this._parent = parent;
                this._setupListeners();

                this.events.emmit('parentchange', {
                    parent: parent
                });
            }
        },

        getParent: function () {
            return this._parent;
        },

        /**
         * @param {HTMLElement} parentElement
         */
        setParentElement: function (parentElement) {
            if (parentElement != this._parentElement) {
                this._parentElement = parentElement;
                parentElement.appendChild(this._element);

                this.events.emmit('parentelementchange', {
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
        },

        _setupListeners: function () {
            this._parent.events
                .add('activate', this._onSlideActivate, this)
                .add('deactivate', this._onSlideDeactivate, this);
        },

        _clearListeners: function () {
            if (this._parent) {
                this._parent.events
                    .remove('activate', this._onSlideActivate, this)
                    .remove('deactivate', this._onSlideDeactivate, this);
            }
        },

        _onSlideActivate: function () {
            this._element.classList.add(cssClasses.active);
        },

        _onSlideDeactivate: function () {
            this._element.classList.remove(cssClasses.active);
        }
    });

    provide(Layout);
});
