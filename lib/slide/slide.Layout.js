/**
 * @fileOverview
 * Slide layout.
 */
modules.define('slide.Layout', [
    'event.Emitter',
    'util.bind',
    'util.extend'
], function (provide, EventEmitter, bind, extend) {

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

        setParent: function (parent) {
            if (this._parent != parent) {
                this._clearListeners();

                this._parent = parent;
                this._setupListeners();

                this.events.emit('parentchange', {
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

                this.events.emit('parentelementchange', {
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
         * Set slide title or create new H2 into slide element with title.
         * @param {String} title
         */
        setTitle: function (title) {
            var titleElement = this._element.querySelector('h2');

            if (titleElement) {
                titleElement.innerHTML = title;
            } else {
                titleElement = document.createElement('h2');
                titleElement.innerHTML = title;
                this._element.insertBefore(titleElement, this._element.firstChild);
            }
        },

        /**
         * @returns {String|Null} Title.
         */
        getTitle: function () {
            var titleElement = this._element.querySelector('h2');
            return titleElement ? titleElement.textContent : null;
        },

        /**
         * @param {String} name Data attr name.
         * @returns {Object} Value.
         */
        getData: function (name) {
            var element = this._element;

            return element.dataset ?
                element.dataset[name] :
                element.getAttribute('data-' + name);
        },

        _setupListeners: function () {
            this._slideListeners = this._parent.events.group()
                .on('activate', this._onSlideActivate, this)
                .on('deactivate', this._onSlideDeactivate, this);

            this._element.addEventListener('click', bind(this._onSlideClick, this), false);
        },

        _clearListeners: function () {
            if (this._slideListeners) {
                this._slideListeners.offAll();
            }

            this._element.removeEventListener('click', bind(this._onSlideClick, this));
        },

        _onSlideActivate: function () {
            this._element.classList.add(cssClasses.active);
        },

        _onSlideDeactivate: function () {
            var elementClassList = this._element.classList;
            elementClassList.remove(cssClasses.active);
            elementClassList.add(cssClasses.visited);
        },

        _onSlideClick: function () {
            this.events.emit('click');
        }
    });

    provide(Layout);
});
