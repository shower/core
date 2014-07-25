/**
 * @fileOverview 
 * Слайд
 */
modules.define('Slide', [
    'event.Emitter',
    'slide.layoutFactory',
    'util.extend'
], function (provide, EventEmitter, slideLayoutFactory, extend) {

    /**
     * @param {String} content
     * @param {Object} options
     */
    function Slide (content, options) {
        this.events = new EventEmitter();
        this.options = extend({
            // default options
        }, options);
        
        this._isActive = null;
        this._position = null;

        this.build();
    }

    extend(Slide.prototype, /** @lends Slide */ {
        build: function () {
            this._layout = new slideLayoutFactory.createClass(content);
        },

        destroy: function () {
            this._isActive = null;
            this._position = null;
            this.options = null;

            this._layout.destroy();
        },

        setActive: function () {
            this._isActive = true;
            this.events.fire('activate');
        },

        /**
         * @returns {Boolean}
         */ 
        isActive: function () {
            return this._isActive;
        },

        setInactive: function () {
            this._isActive = false;
            this.events.fire('deactivate');
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
