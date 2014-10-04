/**
 * @fileOverview
 * History controller for shower.
 */
modules.define('shower.Location', [
    'util.bind',
    'util.extend'
], function (provide, bind, extend) {

    /**
     * @name shower.Location
     * @param {Shower} shower
     * @constructor
     */
    function Location (shower) {
        this._shower = shower;

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
            this._shower.ready(bind(this._init, this));
        },

        destroy: function () {
            this._clearListeners();
        },

        push: function (content) {
            var url = window.location;
            window.history.pushState({}, null, url.pathname + content);
        },

        save: function () {
            window.history.pushState({}, null, this._getCurrentURL());
        },

        _getCurrentURL: function (slide) {
            var shower = this._shower,
                currentSlideId = shower.player.getCurrentSlide().getId(),
                isSlideMode = shower.container.isSlideMode();

            return window.location.pathname +
                (isSlideMode ? '?' + shower.options.location.slideMode : '') +
                '#' + currentSlideId
        },

        _init: function () {
            var shower = this._shower,
                currentSlideId = window.location.hash.substr(1),
                currentSlideIndex = 0,
                slideInfo;

            if (currentSlideId != '') {
                slideInfo = this._getSlideById(currentSlideId);
                window.location.hash = '';
                shower.go(typeof slideInfo.index != 'undefined' ?
                    slideInfo.index :
                    currentSlideIndex
                );
            }

            if (this._isSlideMode()) {
                shower.container.enterSlideMode();
            }
        },

        _setupListeners: function () {
            this._playerListeners = this._shower.player.events.group()
                .on('activate', this._onSlideActivate, this);

            window.addEventListener('popstate', bind(this._onPopstate, this));
        },

        _clearListeners: function () {
            window.removeEventListener('popstate', bind(this._onPopstate, this));
            this._playerListeners.offAll();
        },

        /**
         * @param {String} slideId
         * @return {Object} Slide info with fields .slide & .index.
         */
        _getSlideById: function (slideId) {
            var slides = this._shower.getSlidesArray(),
                slide,
                index;

            for (var i = slides.length - 1; i >= 0; i--) {
                if (slides[i].getId() == slideId) {
                    slide = slides[i];
                    index = i;
                    break;
                }
            }

            return {
                slide: slide,
                index: index
            };
        },

        _onSlideActivate: function (e) {
            window.location.hash = e.get('slide').getId();
        },

        _isSlideMode: function () {
            var slideModeUrl = this._shower.options.location.slideMode,
                regExp = new RegExp('^' + slideModeUrl + '.*');

            return regExp.test(window.location.search.substr(1));
        },

        _onPopstate: function () {
            var shower = this._shower,
                showerContainer = shower.container,
                slideId = window.location.hash.substr(1),
                slideInfo,
                currentSlide = shower.player.getCurrentSlide(),
                currentSlideNumber = shower.player.getCurrentSlideIndex(),
                isSlideMode = this._isSlideMode();

            // Go to first slide, if hash id is invalid or isn't set.
            // Same check is located in DOMContentLoaded event,
            // but it not fires on hash change
            if (isSlideMode && currentSlideNumber === -1) {
                shower.go(0);
            // In List mode, go to first slide only if hash id is invalid.
            } else if (currentSlideNumber === -1 && url.hash !== '') {
                shower.go(0);
            }

            if (currentSlide && slideId != currentSlide.getId()) {
                slideInfo = this._getSlideById(slideId);
                shower.go(slideInfo.index);
            }

            if (!isSlideMode) {
                showerContainer.exitSlideMode();
            } else {
                showerContainer.enterSlideMode();
            }
        }
    });

    provide(Location);
});