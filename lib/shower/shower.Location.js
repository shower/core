/**
 * @fileOverview
 * History controller for shower.
 */
modules.define('shower.Location', [
    'util.bind',
    'util.extend'
], function (provide, bind, extend) {

    /**
     * @name shower.Location
     * @param {Shower} shower
     * @constructor
     */
    function Location (shower) {
        this._shower = shower;
        this._url = window.location;

        this._showerListeners = null;
        this._playerListeners = null;
        this._containerListeners = null;

        var supported = !!(window.history && window.history.pushState);
        if (supported) {
            this.init();
        }
    }

    extend(Location.prototype, /** @lends shower.Location.prototype */{
        init: function () {
            this._setupListeners();
            this._shower.ready(bind(this._init, this));
        },

        destroy: function () {
            this._clearListeners();
        },

        _init: function () {
            var shower = this._shower,
                url = window.location,
                currentSlideId = url.hash.substr(1),
                currentSlideIndex = 0;

            if (currentSlideId != '') {
                var slides = shower.getSlidesArray();
                for (var i = slides.length - 1; i >= 0; i--) {
                    if (slides[i].getId() == currentSlideId) {
                        currentSlideIndex = i;
                        break;
                    }
                }
                shower.go(currentSlideIndex);
            }
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);

            this._containerListeners = shower.container.events.group()
                .on('slidemodeenter', this._onSlideModeEnter, this)
                .on('slidemodeexit', this._onSlideModeExit, this);

            window.addEventListener('popstate', bind(this._onPopstate, this));
        },

        _clearListeners: function () {
            window.removeEventListener('popstate', bind(this._onPopstate, this));

            this._playerListeners.offAll();
            this._containerListeners.offAll();
        },

        /**
         * @ignore
         * @param {Number} slideNumber
         */
        _getSlideHash: function (slideNumber) {
            var slide = this._shower.get(slideNumber);
            return '#' + slide.getId();
        },

        _onSlideActivate: function (e) {
            this._url.hash = this._getSlideHash(e.get('index'));
        },

        _onSlideModeEnter: function () {
            var currentSlideIndex = this._shower.player.getCurrentSlideIndex();
            this._addHistory('?full' + this._getSlideHash(currentSlideIndex));
        },

        _onSlideModeExit: function () {
            var currentSlideIndex = this._shower.player.getCurrentSlideIndex();
            this._addHistory(this._getSlideHash(currentSlideIndex));
        },

        _addHistory: function (content) {
            var url = window.location;
            history.pushState(null, null, url.pathname + content);
        },

        _isSlideMode: function () {
            return /^full.*/.test(window.location.search.substr(1));
        },

        _onPopstate: function () {
            var shower = this._shower,
                showerContainer = shower.container,
                url = window.location,
                currentSlideNumber = shower.player.getCurrentSlideIndex(),
                isSlideMode = this._isSlideMode();

            // Go to first slide, if hash id is invalid or isn't set.
            // Same check is located in DOMContentLoaded event,
            // but it not fires on hash change
            if (isSlideMode && currentSlideNumber === -1) {
                shower.go(0);
            // In List mode, go to first slide only if hash id is invalid.
            } else if (currentSlideNumber === -1 && url.hash !== '') {
                shower.go(0);
            }
            if (!isSlideMode) {
                showerContainer.exitSlideMode();
            } else {
                showerContainer.enterSlideMode();
            }
        }
    });

    provide(Location);
});