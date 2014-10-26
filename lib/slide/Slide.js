/**
 * @file Slide.
 */
modules.define('Slide', [
    'event.Emitter',
    'slide.Layout',
    'slide.layoutFactory',
    'util.extend'
], function (provide, EventEmitter, Layout, slideLayoutFactory, extend) {

    /**
     * @typedef {object} HTMLElement
     */

    /**
     * @class Slide
     * @param {(string|HTMLElement)} content
     * @param {object} [options]
     * @param {object} [state] Current slide state.
     * @param {number} [state.visited=0] Count of visit slide.
     * @param {(number|null)} [state.index=null] Slide index.
     */
    function Slide (content, options, state) {
        this.events = new EventEmitter();
        this.options = extend({
            // default options
        }, options);

        this.state = extend({
            visited: 0,
            index: null
        });

        this._content = content;
        this._isActive = false;
        this._isVisited = false;

        this.init();
    }

    extend(Slide.prototype, /** @lends Slide.prototype */ {

        init: function () {
            this._layout = typeof this._content == 'string' ?
                new slideLayoutFactory.createLayout(this._content) :
                new Layout(this._content);

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
