/**
 * @fileOverview
 * Слайд
 */
modules.define('Slide', [
    'event.Emitter',
    'slide.Layout',
    'slide.layoutFactory',
    'util.extend'
], function (provide, EventEmitter, Layout, slideLayoutFactory, extend) {

    /**
     * @param {String | HTMLElement} content
     * @param {Object} [options]
     * @param {Object} [state]
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
         * @returns {Boolean}
         */
        isActive: function () {
            return this._isActive;
        },

        isVisited: function () {
            return this.state.visited > 0;
        },

        /**
         * @returns {slide.Layout}
         */
        getLayout: function () {
            return this._layout;
        },

        /**
         * @returns {String|Null}
         */
        getTitle: function () {
            return this._layout.getTitle();
        },

        /**
         * @param {String} title
         * @returns {Slide}
         */
        setTitle: function (title) {
            this._layout.setTitle(title);
            return this;
        },

        getId: function () {
            return this._layout.getElement().id;
        },

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
