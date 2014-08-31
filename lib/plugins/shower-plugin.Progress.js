/**
 * @fileOverview
 * Progress plugin for shower.
 *
 * @example
 * modules.require(['shower-plugin.Progress'], function (Progress) {
 *     shower.ready(function () {
 *          var progress = new Progress(shower);
 *     });
 * });
 */
modules.define('shower-plugin.Progress', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * @name shower-plugin.Progress
     * @param {Shower} shower
     * @param {String} [selector = 'div.progress div']
     * @constructor
     */
    function Progress (shower, selector) {
        this._shower = shower;
        this._playerListeners = null;

        this._element = null;
        this._elementSelector = selector || 'div.progress div';

        this.init();
    }

    extend(Progress.prototype, {
        init: function () {
            var showerContainerElement = this._shower.container.getElement();
            this._element = showerContainerElement.querySelector(this._elementSelector);

            if (this._element) {
                this._setupListeners();
            }
        },

        destroy: function () {
            this._playerListeners.removeAll();
            this._shower = null;
        },

        updateProgress: function () {
            var slidesCount = this._shower.getSlidesCount(),
                currentSlideNumber = this._shower.player.getCurrentSlideIndex();

            this._element.style.width = (100 / (slidesCount - 1)) * currentSlideNumber.toFixed(2) + '%';
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .add('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .add('slidechange', this._onSlideChange, this);
        },

        _clearListeners: function () {
            this._showerListeners.removeAll();
            this._playerListeners.removeAll();
        },

        _onSlideChange: function () {
            this.updateProgress();
        }
    });

    provide(Progress);
});