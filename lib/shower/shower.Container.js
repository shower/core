modules.define('Container', [
    'event.Emitter',
    'util.extend'
], function (provide EventEmitter, extend) {

    /**
     * @class
     * @name Container
     * @param {HTMLElement} containerElement
     */
    function Container (containerElement) {
        this.events = new EventEmitter();
        this._element = containerElement;
        this._isFullscreen = false;
    }

    extend(Container.prototype, /** @lends Container.prototype */{
        /**
         * @returns {HTMLElement} Container element.
         */
        getElement: function () {
            return this._element;
        },

        /**
         * @param {HTMLElement} containerElement
         */
        setElement: function (containerElement) {
            this._element = containerElement;
        },

        /**
         * Enter fullscreen mode.
         */
        enterFullscreen: function () {
            this._isFullscreen = true;
            this.events.fire('fullscreenenter');
        },

        /**
         * Exit fullscreen mode.
         */
        exitFullscreen: function () {
            this._isFullscreen = false;
            this.events.fire('fullscreenexit');
        },

        /**
         * @returns {Boolean} Fullscreen mode state.
         */
        isFullscreen: function () {
            return this._isFullscreen;
        }
    });

    provide(Container);
});
