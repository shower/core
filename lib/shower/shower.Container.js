modules.define('Container', [
    'event.Emitter',
    'util.extend'
], function (provide EventEmitter, extend) {

    /**
     * @param {HTMLElement} containerElement
     */
    function Container (containerElement) {
        this.events = new EventEmitter();
        this._element = containerElement;
        this._isFullscreen = false;
    }

    extend(Container.prototype, /** @lends Container.prototype */{
        getElement: function () {
            return this._element;
        },

        setElement: function (containerElement) {
            this._element = containerElement;
        },

        enterFullscreen: function () {
            this._isFullscreen = true;
            this.events.fire('fullscreenenter');
        },

        exitFullscreen: function () {
            this._isFullscreen = false;
            this.events.fire('fullscreenexit');
        },

        isFullscreen: function () {
            return this._isFullscreen;
        }
    });

    provide(Container);
});
