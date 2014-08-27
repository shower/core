/**
 * @fileOverview
 * Slide layout.
 */
modules.define('slide.Layout', [
    'event.Emitter',
    'util.dom',
    'util.extend'
], function (provide, EventEmitter, utilDom, extend) {

    var cssClasses = {
        active: 'active',
        visited: 'visited'
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

        /**
         * @param {String} id
         */
        setElementId: function (id) {
            this._element.id = id;
        },

        /**
         * @returns {String} Slide element ID.
         */
        getElementId: function () {
            return this._element.id;
        },

        /**
         * Set slide title or create new H2 into slide element with title.
         * @param {String} title
         */
        setTitle: function (title) {
            var titleElement = utilDom.find('h2', this._element);

            if (titleElement) {
                titleElement.innerHTML = title;
            } else {
                titleElement = utilDom.create({
                    tag: 'h2',
                    content: title
                });

                this._element.insertBefore(titleElement, this._element.firstChild);
            }
        },

        /**
         * @returns {String|Null} Title.
         */
        getTitle: function () {
            var titleElement = utilDom.find('h2', this._element);
            return titleElement ? titleElement.textContent : null;
        },

        _setupListeners: function () {
            this._slideListeners = this._parent.events.group()
                .add('activate', this._onSlideActivate, this)
                .add('deactivate', this._onSlideDeactivate, this);
        },

        _clearListeners: function () {
            if (this._slideListeners) {
                this._slideListeners.removeAll();
            }
        },

        _onSlideActivate: function () {
            var element = this._element;

            element.classList.remove(cssClasses.visited);
            element.classList.add(cssClasses.active);
        },

        _onSlideDeactivate: function () {
            var element = this._element;

            element.classList.remove(cssClasses.active);
            element.classList.add(cssClasses.visited)
        }
    });

    provide(Layout);
});
