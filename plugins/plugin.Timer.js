/**
 * @fileOverview
 * Timer plugin for shower.
 *
 * @example
 * modules.require(['shower', 'plugin.Timer'], function (shower, Timer) {
 *     shower.ready(function () {
 *          var TimerPlugin = new Timer(shower);
 *     });
 * });
 */
modules.define('plugin.Timer', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Timer plugin for shower.
     * @name plugin.Timer
     * @param {Shower} shower
     * @constructor
     */
    function Timer (shower) {
        this._shower = shower;
        this._timer = null;

        this._showerListeners = null;
        this._playerListeners = null;

        this.init();
    }

    extend(Timer.prototype, /** @lends plugin.Timer.prototype */{

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
                .on('activate', this._onSlideActivate, this)
                .on('plugintimernext', this._onTimerNext, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideActivate: function () {
            this._clearTimer();

            if (this._shower.container.isSlideMode()) {
                var currentSlide = this._shower.player.getCurrentSlide(),
                    timing = currentSlide.getLayout().getData('timing');

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
            }
        },

        _onTimerNext: function () {
            this._shower.next();
            this._clearTimer();
        },

        _initTimer: function (Timer) {
            this._timer = setInterval(function () {
                this._shower.player.events.emit('plugintimernext');
            }.bind(this), Timer);
        },

        _clearTimer: function () {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null;
            }
        }
    });

    provide(Timer);
});