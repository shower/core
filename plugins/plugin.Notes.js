/**
 * @fileOverview
 * Presenter notes plugin for shower.
 *
 * @example
 * modules.require(['shower', 'plugin.Notes'], function (shower, Notes) {
 *     shower.ready(function () {
 *          var notes = new Notes(shower);
 *     });
 * });
 */
modules.define('plugin.Notes', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Presenter notes plugin for shower.
     * @name plugin.Notes
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @param {String} [options.selector = 'footer']
     * @constructor
     */
    function Notes (shower, options) {
        options = options || {};
        this._shower = shower;
        this._notesSelector = options.selector || 'footer';

        this.init();
    }

    extend(Notes.prototype, /** @lends plugin.Notes.prototype */{

        init: function () {
            this._setupListeners();
        },

        destroy: function () {
            this.clear();
            this._clearListeners();
            this._shower = null;
        },

        show: function () {
            this.clear();

            var shower = this._shower,
                slide = shower.player.getCurrentSlide(),
                slideLayout = slide.getLayout(),
                notes = slideLayout.getElement().querySelector(this._notesSelector);

            if (notes && notes.innerHTML) {
                console.info(notes.innerHTML.replace(/\n\s+/g, '\n'));
            }

            var currentSlideNumber = shower.player.getCurrentSlideIndex(),
                nextSlide = shower.get(currentSlideNumber + 1);

            if (nextSlide) {
                console.info('NEXT: ' + nextSlide.getTitle());
            }
        },

        clear: function () {
            if (this._shower.container.isSlideMode() && !this._shower.options.debugMode) {
                console.clear();
            }
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideActivate: function () {
            this.show();
        }
    });

    provide(Notes);
});