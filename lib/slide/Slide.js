/**
 * @file Slide.
 */
modules.define('Slide', [
    'shower.defaultOptions',
    'Emitter',
    'Options',
    'slide.Layout',
    'slide.layoutFactory',
    'util.extend'
], function (provide, defaultOptions, EventEmitter, OptionsManager, Layout, slideLayoutFactory, extend) {

    /**
     * @typedef {object} HTMLElement
     */

    /**
     * @class
     * @name Slide
     *
     * Slide class.
     *
     * @param {(string|HTMLElement)} content
     * @param {object} [options]
     * @param {string} [options.title_element_selector = 'H2']
     * @param {string} [options.active_classname = 'active']
     * @param {string} [options.visited_classname = 'visited']
     * @param {object} [state] Current slide state.
     * @param {number} [state.visited=0] Count of visit slide.
     */
    function Slide(content, options, state) {
        this.events = new EventEmitter();
        this.options = new OptionsManager(options);
        this.state = extend({
            visited: 0,
            index: null
        }, state || {});

        this._content = content;
        this._isVisited = this.state.visited > 0;
        this._isActive = false;

        this.init();
    }

    extend(Slide.prototype, /** @lends Slide.prototype */ {

        init: function () {
            this._layout = typeof this._content === 'string' ?
                new slideLayoutFactory.createLayout({
                    content: this._content
                }) :
                new Layout(this._content, this.options);

            this._layout.setParent(this);

            this._setupListeners();
        },

        destroy: function () {
            this._clearListeners();

            this._isActive = null;
            this.options = null;

            this._layout.destroy();
        },

        /**
         * Activate slide.
         *
         * @returns {Slide}
         */
        activate: function () {
            this._isActive = true;

            this.state.visited++;
            this.events.emit('activate', {
                slide: this
            });

            return this;
        },

        /**
         * Deavtivate slide.
         *
         * @returns {Slide}
         */
        deactivate: function () {
            this._isActive = false;
            this.events.emit('deactivate', {
                slide: this
            });

            return this;
        },

        /**
         * Get active state.
         *
         * @returns {boolean}
         */
        isActive: function () {
            return this._isActive;
        },

        /**
         * Get visited state.
         *
         * @returns {boolean}
         */
        isVisited: function () {
            return this.state.visited > 0;
        },

        /**
         * Get slide layout.
         *
         * @returns {slide.Layout}
         */
        getLayout: function () {
            return this._layout;
        },

        /**
         * Get slide title.
         *
         * @borrows slide.Layout.getTitle
         */
        getTitle: function () {
            return this._layout.getTitle();
        },

        /**
         * Set slide title.
         *
         * @borrows slide.Layout.getTitle
         * @returns {Slide}
         */
        setTitle: function (title) {
            this._layout.setTitle(title);
            return this;
        },

        /**
         * Get id of slide element.
         *
         * @returns {(string|undefined)}
         */
        getId: function () {
            return this._layout.getElement().id;
        },

        /**
         * Get slide content.
         *
         * @borrows slide.Layout.getContent
         */
        getContent: function () {
            return this._layout.getContent();
        },

        _setupListeners: function () {
            this._layoutListeners = this._layout.events.group()
                .on('click', this._onSlideClick, this);
        },

        _clearListeners: function () {
            this._layoutListeners.offAll();
        },

        _onSlideClick: function () {
            this.activate();

            this.events.emit('click', {
                slide: this
            });
        }
    });

    provide(Slide);
});
