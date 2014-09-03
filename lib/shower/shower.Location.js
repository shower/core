/**
 * @fileOverview
 * History controller for shower.
 */
modules.define('shower.Location', [
    'util.extend'
], function (provide, extend) {

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
            this._shower.ready(this._initLocationData.bind(this));
        },

        destroy: function () {
            this._clearListeners();
        },

        _initLocationData: function () {
            var currentSlideId = this._url.hash.substr(1);
            if (currentSlideId != '') {
                var slides = this._shower.getSlidesArray();
                for (var i = slides.length - 1; i >= 0; i--) {
                    if (slides[i].getId() == currentSlideId) {
                        this._url.hash = '';
                        this._shower.player.go(i);
                        break;
                    }
                }
            }

            if (/^full.*/.test(this._url.search.substr(1))) {
                this._shower.container.enterSlideMode();
            }
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);

            this._containerListeners = shower.container.events.group()
                .on('slidemodeenter', this._onSlideModeEnter, this)
                .on('slidemodeexit', this._onSlideModeExit, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
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
            window.history.pushState(null, null, this._url.pathname + content);
        }
    });

    provide(Location);
});