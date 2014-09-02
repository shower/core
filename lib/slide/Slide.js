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
     * @param {Object} options
     */
    function Slide (content, options) {
        this.events = new EventEmitter();
        this.options = extend({
            // default options
        }, options);

        this._content = content;

        this._isActive = null;
        this._position = null;

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
            this._position = null;
            this.options = null;

            this._layout.destroy();
        },

        activate: function () {
            this._isActive = true;
            this.events.emmit('activate', {
                slide: this
            });
        },

        deactivate: function () {
            this._isActive = false;
            this.events.emmit('deactivate', {
                slide: this
            });
        },

        /**
         * @returns {Boolean}
         */ 
        isActive: function () {
            return this._isActive;
        },

        /**
         *  @returns {Number}
         */
        getPosition: function () {
            return this._position;  
        },

        getLayout: function () {
            return this._layout;
        },

        getTitle: function () {
            return this._layout.getTitle();
        },

        setTitle: function (title) {
            return this._layout.setTitle(title);
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

            this.events.emmit('click', {
                slide: this
            });
        }
    });

    provide(Slide);
});
