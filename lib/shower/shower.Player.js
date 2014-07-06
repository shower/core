/**
 * @fileOverview
 * Slides player.
 */
modules.define('shower.Player', [
    'event.Emitter',
    'util.extend',
    'util.bind'
], function (provide, EventEmitter, extend, bind) {

    /**
     * @class
     * @name shower.Player
     * @param {Shower} shower
     */
    function Player (shower) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._currentSlideNumber = 0;
        this._currentSlide = null;
        this._playerLoop = null;

        this._init();
    }

    extend(Player.prototype, /** @lends shower.Player.prototype */ {
        /**
         * Next slide.
         * @returns {shower.Player}
         */
        next: function () {
            var currentSlideNumber = this._currentSlideNumber;

            if (this._shower.getSlidesCount() < (currentSlideNumber + 1)) {
                this._changeSlide(currentSlideNumber + 1);
                this.events.fire('next');
            } else {
                if (this._playerLoop) {
                    this.stop();
                }
            }

            return this;
        },

        /**
         * Prev slide.
         * @returns {shower.Player}
         */
        prev: function () {
            this._changeSlide(this._currentSlideNumber - 1);
            this.events.fire('prev');

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
            this._playerLoop = setInterval(bind(function () {
                if (this._currentSlideNumber == options.stopIndex) {
                    this.stop();
                } else {
                    this.next();
                }
            }, this), options.timeout);

            this.events.fire('play');
        },

        /**
         * Stop slideshow.
         */
        stop: function () {
            if (this._playerLoop) {
                clearInterval(this._playerLoop);
                this._playerLoop = null;
            }
            this.events.fire('stop');
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

                this.events.fire('activate', {
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

        /**
         * @ignore
         * Init player state.
         */
        _init: function () {
            // get active slide
            // check init data
        },

        /**
         * @ignore
         * @param {Number} index Slide index.
         */
        _changeSlide: function (index) {
            this.setActive(index);
            this.events.fire('slidechange');
        }
    });

    provide(Player);
});
