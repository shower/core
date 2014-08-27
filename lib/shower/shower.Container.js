modules.define('shower.Container', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    /**
     * @class
     * @name shower.Container
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
            this._applyTransform(this._getTransformScale());

            this._isFullscreen = true;
            this.events.emmit('fullscreenenter');
        },

        /**
         * Exit fullscreen mode.
         */
        exitFullscreen: function () {
            this._applyTransform('none');

            this._isFullscreen = false;
            this.events.emmit('fullscreenexit');
        },

        /**
         * @returns {Boolean} Fullscreen mode state.
         */
        isFullscreen: function () {
            return this._isFullscreen;
        },

        _getTransformScale: function () {
            var denominator = Math.max(
                document.body.clientWidth / window.innerWidth,
                document.body.clientHeight / window.innerHeight
            );

            return 'scale(' + (1 / denominator) + ')';
        },

        _applyTransform: function (transformValue) {
            [
                'WebkitTransform',
                'MozTransform',
                'msTransform',
                'OTransform',
                'transform'
            ].forEach(function (property) {
                document.body.style[property] = transformValue;
            });
        }
    });

    provide(Container);
});
