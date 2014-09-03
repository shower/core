/**
 * @fileOverview
 * History controller for shower.
 */
modules.define('shower.History', [
    'util.extend'
], function (provide, extend) {

    /**
     * @name shower.History
     * @param {Shower} shower
     * @constructor
     */
    function History (shower) {
        this._shower = shower;
        this._url = window.location;

        this._showerListeners = null;
        this._playerListeners = null;
        this._containerListeners = null;

        var supported = !!(window.history && window.history.pushState);
        if (supported) {
            this._setupListeners();
        }
    }

    extend(History.prototype, /** @lends shower.History.prototype */{
        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this._destroy, this);

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

        _destroy: function () {
            this._clearListeners();
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

    provide(History);
});