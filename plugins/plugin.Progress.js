/**
 * @fileOverview
 * Progress plugin for shower.
 *
 * @example
 * modules.require(['shower', 'plugin.Progress'], function (shower, Progress) {
 *     shower.ready(function () {
 *          var progress = new Progress(shower);
 *     });
 * });
 */
modules.define('plugin.Progress', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Progress plugin for shower.
     * @name plugin.Progress
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @param {String} [options.selector = '.shower__progress']
     * @constructor
     */
    function Progress (shower, options) {
        options = options || {};
        this._shower = shower;
        this._playerListeners = null;

        this._element = null;
        this._elementSelector = options.selector || '.shower__progress';

        this.init();
    }

    extend(Progress.prototype, /** @lends plugin.Progress.prototype */{

        init: function () {
            var showerContainerElement = this._shower.container.getElement();
            this._element = showerContainerElement.querySelector(this._elementSelector);

            if (this._element) {
                this._setupListeners();
            }

            this.updateProgress();
        },

        destroy: function () {
            this._clearListeners();
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
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideChange, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideChange: function () {
            this.updateProgress();
        }
    });

    provide(Progress);
});