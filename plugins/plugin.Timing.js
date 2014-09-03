/**
 * @fileOverview
 * Timing plugin for shower.
 *
 * @example
 * modules.require(['shower', 'plugin.Timing'], function (shower, Timing) {
 *     shower.ready(function () {
 *          var timingPlugin = new Timing(shower);
 *     });
 * });
 */
modules.define('plugin.Timing', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Timing plugin for shower.
     * @name plugin.Timing
     * @param {Shower} shower
     * @constructor
     */
    function Timing (shower) {
        this._shower = shower;
        this._timer = null;

        this._showerListeners = null;
        this._playerListeners = null;

        this.init();
    }

    extend(Timing.prototype, /** @lends plugin.Timing.prototype */{

        init: function () {
            this._setupListeners();

            if (this._shower.player.getCurrentSlideIndex() != -1) {
                this._onSlideActivate();
            }
        },

        destroy: function () {
            this._clearTimer();
            this._clearListeners();

            this._shower = null;
        },

        _setupListeners: function () {
            this._showerListeners = this._shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = this._shower.player.events.group()
                .on('activate', this._onSlideActivate, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideActivate: function () {
            this._clearTimer();

            var currentSlide = this._shower.player.getCurrentSlide(),
                slideData = currentSlide.getLayout().getData(),
                timing = slideData.timing;

            if (timing && /^(\d{1,2}:)?\d{1,3}$/.test(timing)) {
                if (timing.indexOf(':') !== -1) {
                    timing = timing.split(':');
                    timing = (parseInt(timing[0], 10) * 60 + parseInt(timing[1], 10)) * 1000;
                } else {
                    timing = parseInt(timing, 10) * 1000;
                }

                if (timing !== 0) {
                    this._initTimer(timing);
                }
            }
        },

        _initTimer: function (timing) {
            this._timer = setTimeout(function () {
                this._shower.next();
                this._timer = null;
            }.bind(this), timing);
        },

        _clearTimer: function () {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
        }
    });

    provide(Timing);
});