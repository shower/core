/**
 * @fileOverview
 * Inner navigation shower plugin.
 *
 * @example
 * modules.require(['shower', 'plugin.Navigation'], function (shower, Navigation) {
 *     shower.ready(function () {
 *          var Navigation = new Navigation(shower, '.next');
 *          console.log(Navigation.getInnerLength() + " inner items");
 *     });
 * });
 */
modules.define('plugin.Navigation', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * @name plugin.Navigation
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @param {String} [options.selector = '.next']
     * @constructor
     */
    function Navigation (shower, options) {
        options = options || {};

        this._shower = shower;
        this._elementsSelector = options.selector || '.next';
        this._elements = [];

        this._innerComplete = 0;
        this.init();
    }

    extend(Navigation.prototype, /** @lends plugin.Navigation.prototype */{

        init: function () {
            this._setupListeners();
            if (this._shower.player.getCurrentSlideIndex() != -1) {
                this._onSlideActivate();
            }
        },

        destroy: function () {
            this._clearListeners();

            this._elements = null;
            this._elementsSelector = null;
            this._innerComplete = null;
            this._shower = null;
        },

        /**
         * Activate next inner item.
         * @return {plugin.Navigation}
         */
        next: function () {
            if (!this._elements) {
                throw new Error('Inner nav elements not found.');
            }

            this._innerComplete++;
            
            for (var i = 0, k = this._elements.length; i < k; i++) {
                var element = this._elements[i];

                if (i < this._innerComplete) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            }
            return this;
        },

        /**
         * @returns {Number} Inner elements count.
         */
        getInnerLength: function () {
            return this._elements.length;
        },

        /**
         * @returns {Number} Completed inner elements count.
         */
        getInnerComplete: function () {
            return this._innerComplete;
        },

        _setupListeners: function () {
            this._showerListeners = this._shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = this._shower.player.events.group()
                .on('activate', this._onSlideActivate, this)
                .on('next', this._onNext, this)
                // Support timer plugin.
                .on('plugintimernext', this._onPluginTimerNext, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onNext: function (e) {
            var elementsLength = this._elements.length;
            if (elementsLength && this._innerComplete < elementsLength) {
                e.preventDefault();
                this.next();
            }
        },

        _onPluginTimerNext: function (e) {
            if (this._elements.length) {
                e.preventDefault();
                this._shower.next();
            }
        },

        _onSlideActivate: function () {
            var slideLayout = this._shower.player.getCurrentSlide().getLayout(),
                slideElement = slideLayout.getElement();

            this._elements = slideElement.querySelectorAll(this._elementsSelector);
            this._elements = Array.prototype.slice.call(this._elements);

            this._innerComplete = this._getInnerComplete();
        },

        _getInnerComplete: function () {
            return this._elements.filter(function (element) {
                return element.classList.contains('active');
            }).length;
        }
    });

    provide(Navigation)
});