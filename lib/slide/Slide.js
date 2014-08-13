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

        this.build();
    }

    extend(Slide.prototype, /** @lends Slide */ {
        build: function () {
            this._layout = typeof  this._content == 'string' ?
                new slideLayoutFactory.createLayout(this._content) :
                new Layout(this._content);

            this._layout.setParent(this);
        },

        destroy: function () {
            this._isActive = null;
            this._position = null;
            this.options = null;

            this._layout.destroy();
        },

        setActive: function () {
            this._isActive = true;
            this.events.emmit('activate');
        },

        /**
         * @returns {Boolean}
         */ 
        isActive: function () {
            return this._isActive;
        },

        setInactive: function () {
            this._isActive = false;
            this.events.emmit('deactivate');
        },

        /**
         *  @returns {Number}
         */
        getPosition: function () {
            return this._position;  
        },

        getLayout: function () {
            return this._layout;
        }
    });

    provide(Slide);
});
