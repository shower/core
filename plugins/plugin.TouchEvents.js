/**
 * @fileOverview
 * Touch events plugin for shower.
 *
 * @example
 * modules.require(['shower', 'plugin.TouchEvents'], function (shower, TouchEvents) {
 *     shower.ready(function () {
 *          var touchEvents = new TouchEvents(shower);
 *     });
 * });
 */
modules.define('plugin.TouchEvents', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Touch events plugin for shower.
     * @name plugin.TouchEvents
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @constructor
     */
    function TouchEvents (shower, options) {
        options = options || {};
        this._shower = shower;

        // TODO: Gestures: pan, pinch, tap, swipe etc.
        // HammerJS?
        this._gestures = options.gestures;

        this.init();
    }

    extend(TouchEvents.prototype, /** @lends plugin.TouchEvents.prototype */{

        init: function () {
            this._setupListeners();
        },

        destroy: function () {
            this._clearListeners();
            this._shower = null;
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            document.addEventListener('touchstart', this._onTouchStart.bind(this), false);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            document.removeEventListener('touchstart', this._onTouchStart.bind(this), false);
        },

        _onTouchStart: function (e) {
            var shower = this._shower,
                isSlideMode = shower.container.isSlideMode(),
                element = e.target,
                slide = this._getSlideByElement(element),
                x;

            if (slide) {
                if (isSlideMode && !this._isInteractiveElement(element)) {
                    x = e.touches[0].pageX;
                    if (x > window.innerWidth / 2) {
                        shower.next();
                    } else {
                        shower.prev();
                    }
                }

                if (!isSlideMode) {
                    // Go && turn on slide mode.
                    slide.activate();
                }
            }
        },

        _getSlideByElement: function (element) {
            var slides = this._shower.getSlidesArray(),
                result = null;

            for (var i = 0, k = slides.length; i < k; i++) {
                if (element.id == slides[i].getId()) {
                    result = this._shower.get(i);
                    break;
                }
            }

            return result;
        },

        _isInteractiveElement: function (element) {
            return element.nodeType == 'A';
        }
    });

    provide(TouchEvents);
});