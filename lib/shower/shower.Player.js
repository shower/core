/**
 * @fileOverview
 * Slides player.
 */
modules.define('shower.Player', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    /**
     * @class
     * @name shower.Player
     * @param {Shower} shower
     */
    function Player (shower) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._currentSlideNumber = -1;
        this._currentSlide = null;
        this._playerLoop = null;

        this._documentTitle = null;

        this._init();
    }

    extend(Player.prototype, /** @lends shower.Player.prototype */ {
        /**
         * Next slide.
         * @returns {shower.Player}
         */
        next: function () {
            this.events.emmit('next');
            return this;
        },

        /**
         * Prev slide.
         * @returns {shower.Player}
         */
        prev: function () {
            this.events.emmit('prev');
            return this;
        },

        /**
         * Play slideshow.
         * @param {Object} [options] Play options.
         * @param {Number} [options.timeout = 2000]
         * @param {Number} [options.startIndex = 0]
         * @param {Number} [options.stopIndex]
         */
        play: function (options) {
            options = extend({
                timeout: 2000,
                startIndex: 0,
                stopIndex: this._shower.getSlidesCount()
            }, options || {});

            if (this._playerLoop) {
                this.stop();
            }
            this.setActive(options.startIndex);
            this._playerLoop = setInterval(function () {
                var currentSlideNumber = this._currentSlideNumber;
                if (
                    currentSlideNumber == options.stopIndex ||
                    currentSlideNumber < this._shower.getSlidesCount()
                ) {
                    this.stop();
                } else {
                    this.next();
                }
            }.bind(this), options.timeout);

            this.events.emmit('play');
        },

        /**
         * Stop slideshow.
         */
        stop: function () {
            if (this._playerLoop) {
                clearInterval(this._playerLoop);
                this._playerLoop = null;
            }
            this.events.emmit('stop');
        },

        /**
         * @param {Number} index Slide index to activate.
         * @returns {shower.Player}
         */
        setActive: function (index) {
            var slidesCount = this._shower.getSlidesCount(),
                currentSlide = this._currentSlide;

            if (index < slidesCount && index >= 0) {
                if (currentSlide) {
                    currentSlide.setInactive();
                }
                currentSlide = this._shower.get(index);
                currentSlide.setActive();

                this._currentSlide = currentSlide;
                this._currentSlideNumber = index;

                this.events.emmit('activate', {
                    index: index
                });
            }

            return this;
        },

        /**
         * @returns {Slide} Current slide.
         */
        getCurrentSlide: function () {
            return this._currentSlide;
        },

        /**
         * @returns {Number} Current slide index.
         */
        getCurrentSlideIndex: function () {
            return this._currentSlideNumber;
        },

        destroy: function () {
            this._showerContainerListeners.removeAll();
            this._playerListeners.removeAll();

            this._currentSlide = null;
            this._currentSlideNumber = null;
            this._playerLoop = null;
            this._documentTitle = null;
            this._shower = null;
        },

        /**
         * @ignore
         * Init player state.
         */
        _init: function () {
            this._showerContainerListeners = this._shower.container.events.group()
                .add('fullscreenenter', this._onFullscreenEnter, this)
                .add('fullscreenexit', this._onFullscreenExit, this);

            this._playerListeners = this.evens.group()
                .add('prev', this._onPrev, this)
                .add('next', this._onNext, this);

            // get active slide
            // check init data
        },

        _onPrev: function () {
            this._changeSlide(this._currentSlideNumber - 1);
        },

        _onNext: function () {
            this._changeSlide(this._currentSlideNumber + 1);
        },

        /**
         * @ignore
         * @param {Number} index Slide index.
         */
        _changeSlide: function (index) {
            this.setActive(index);
            this.events.emmit('slidechange');
        },

        _onFullscreenEnter: function () {
            var slideTitle = this._currentSlide.getTitle();
            if (slideTitle) {
                this._documentTitle = document.title;
                document.title = slideTitle;
            }
        },

        _onFullscreenExit: function () {
            if (this._documentTitle) {
                document.title = this._documentTitle;
                this._documentTitle = null;
            }
        }
    });

    provide(Player);
});
