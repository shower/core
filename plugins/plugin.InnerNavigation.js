/**
 * @fileOverview
 * Inner navigation shower plugin.
 *
 * @example
 * modules.require(['shower', 'plugin.InnerNavigation'], function (shower, InnerNavigation) {
 *     shower.ready(function () {
 *          var innerNavigation = new InnerNavigation(shower, '.next');
 *          console.log(innerNavigation.getInnerLength() + " inner items");
 *     });
 * });
 */
modules.define('plugin.InnerNavigation', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * @name plugin.InnerNavigation
     * @param {Shower} shower
     * @param {String} [selector = '.next']
     * @constructor
     */
    function InnerNavigation (shower, selector) {
        this._shower = shower;

        this._elementsSelector = selector || '.next';
        this._elements = null;

        this._innerComplete = 0;

        this.init();
    }

    extend(InnerNavigation.prototype, /** @lends plugin.InnerNavigation.prototype */{

        init: function () {
            this._setupListeners();
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
         * @return {plugin.InnerNavigation}
         */
        next: function () {
            if (!this._elements) {
                throw new Error('Inner nav elements not found.');
            }

            if (this._innerComplete) {
                var prevElementClassList = this._elements[this._innerComplete - 1].classList;
                prevElementClassList.remove('active');

                if (!prevElementClassList.contains('visited')) {
                    prevElementClassList.add('visited');
                }
            }

            var elementClassList = this._elements[this._innerComplete].classList;
            elementClassList.add('active');

            this._innerComplete++;
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
                .add('destroy', this.destroy, this);

            this._playerListeners = this._shower.player.events.group()
                .add('activate', this._onActivate, this)
                .add('next', this._onNext, this);
        },

        _clearListeners: function () {
            this._showerListeners.removeAll();
            this._playerListeners.removeAll();
        },

        _onNext: function (e) {
            if (this._elements && this._innerComplete != this._elements.length) {
                e.preventDefault();
                this.next();
            }
        },

        _onActivate: function () {
            var slideLayout = this._shower.player.getCurrentSlide().getLayout(),
                slideElement = slideLayout.getElement();

            this._elements = slideElement.querySelectorAll(this._elementsSelector);
            this._innerComplete = 0;

            if (this._elements) {
                this._innerComplete = this._getInnerComplete();
            }
        },

        _getInnerComplete: function () {
            return this._elements.filter(function (element) {
                return element.classList.contains('visited');
            }).length;
        }
    });

    provide(InnerNavigation)
});