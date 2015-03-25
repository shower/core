/**
 * @file History controller for shower.
 */
modules.define('shower.Location', [
    'util.bind',
    'util.extend'
], function (provide, bind, extend) {

    /**
     * @typedef {object} slideInfo
     * @property {Slide} slide Slide instance.
     * @property {number} index Slide index.
     */

    /**
     * @class
     * @name shower.Location
     *
     * @param {Shower} shower
     */
    function Location (shower) {
        this._shower = shower;

        this._showerListeners = null;
        this._playerListeners = null;
        this._documentTitle = document.title;

        this._popStateProcess = null;

        this.init();
    }

    extend(Location.prototype, /** @lends shower.Location.prototype */{
        init: function () {
            this._setupListeners();
            if (this._shower.ready()) {
                this._slideModeUrlParam = this._shower.options.location.slideMode;
                this._init();
            } else {
                this._shower.ready(bind(this._init, this));
            }
        },

        destroy: function () {
            this._clearListeners();
        },

        /**
         * Save current Shower state, e.g.:
         * - slide (index or id);
         * - slide mode.
         */
        save: function () {
            var currentState = this._getCurrentState();
            window.history.pushState(
                {
                    slideMode: currentState.slideMode,
                    slideId: currentState.slide && currentState.slide.id
                },
                null,
                currentState.url
            );
        },

        _init: function () {
            var shower = this._shower,
                currentSlideId = window.location.hash.substr(1),
                currentSlideIndex = 0,
                slideInfo,
                bodyClassList = document.body.classList,
                slideModeClass = shower.options.container.mode.full;

            window.location.hash = '';

            if (currentSlideId != '') {
                slideInfo = this._getSlideById(currentSlideId);
                shower.go(typeof slideInfo.index != 'undefined' ?
                        slideInfo.index :
                        currentSlideIndex
                );
            }

            // Check classlist only when first initialization.
            if (this._isSlideMode() || bodyClassList.contains(slideModeClass)) {
                if (!shower.player.getCurrentSlide()) {
                    shower.go(0);
                }
                shower.container.enterSlideMode();
            }

            this._inited = true;
        },

        _getCurrentState: function () {
            var shower = this._shower,
                currentSlide = shower.player.getCurrentSlide(),
                isSlideMode = shower.container.isSlideMode(),
                info = {
                    slideMode: isSlideMode
                };

            if (currentSlide) {
                info.slide = {
                    instance: currentSlide,
                    id: currentSlide.getId()
                };
            }

            info.url = this._getCurrentURL(info);

            return info;
        },

        _getCurrentURL: function (info) {
            var path = [window.location.pathname];

            if (info.slideMode) {
                path.push('?' + this._slideModeUrlParam);
            }

            if (info.slide) {
                path.push('#' + info.slide.id);
            }

            return path.join('');
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);

            this._containerListener = shower.container.events.group()
                .on(['slidemodeenter', 'slidemodeexit'], this._onContainerSlideModeChange, this);

            window.addEventListener('popstate', bind(this._onPopstate, this));
        },

        _clearListeners: function () {
            window.removeEventListener('popstate', bind(this._onPopstate, this));
            this._playerListeners.offAll();
            this._containerListener.offAll();
        },

        /**
         * @ignore
         * @param {string} slideId
         * @return {slideInfo} Slide info object.
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
            this._setTitle();
        },

        _onContainerSlideModeChange: function () {
            this._setTitle();
            if (!this._popStateProcess && typeof window.history.pushState != 'undefined') {
                this.save();
            }
        },

        _isSlideMode: function (byPopState) {
            var isSlideMode,
                slideModeUrl,
                regExp;

            if (!this._inited || byPopState) {
                slideModeUrl = this._slideModeUrlParam,
                regExp = new RegExp('^' + slideModeUrl + '.*');

                isSlideMode = regExp.test(window.location.search.substr(1));
            } else {
                isSlideMode = this._shower.container.isSlideMode();
            }

            return isSlideMode;
        },

        _onPopstate: function () {
            if (this._inited) {
                this._popStateProcess = true;

                var shower = this._shower,
                    showerContainer = shower.container,
                    slideId = window.location.hash.substr(1),
                    slideInfo,
                    currentSlide = shower.player.getCurrentSlide(),
                    currentSlideNumber = shower.player.getCurrentSlideIndex(),
                    isSlideMode = this._isSlideMode(true);

                // Go to first slide, if hash id is invalid or isn't set.
                // Same check is located in DOMContentLoaded event,
                // but it not fires on hash change
                if (isSlideMode && currentSlideNumber === -1) {
                    shower.go(0);
                // In List mode, go to first slide only if hash id is invalid.
                } else if (currentSlideNumber === -1 && window.location.hash !== '') {
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

                this._popStateProcess = false;
            }
        },

        _setTitle: function () {
            var title = document.title,
                isSlideMode = this._isSlideMode(),
                currentSlide = this._shower.player.getCurrentSlide();

            if (isSlideMode && currentSlide) {
                var slideTitle = currentSlide.getTitle();
                if (slideTitle) {
                    document.title = slideTitle + ' — ' + this._documentTitle;
                } else {
                    document.title = this._documentTitle;
                }
            } else if (this._documentTitle != title) {
                document.title = this._documentTitle
            }
        }
    });

    provide(Location);
});
