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

        this._documentTitle = null;

        this.init();
    }

    extend(Player.prototype, /** @lends shower.Player.prototype */ {

        /**
         * Init player.
         */
        init: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('slideadd', this._onSlideAdd, this)
                .on('slideremove', this._onSlideRemove, this);

            this._showerContainerListeners = shower.container.events.group()
                .on('slidemodeenter', this._onSlideModeEnter, this)
                .on('slidemodeenter', this._onSlideModeExit, this);

            this._playerListeners = this.events.group()
                .on('prev', this._onPrev, this)
                .on('next', this._onNext, this);

            document.addEventListener('keydown', this._onKeyDown.bind(this));

            // get active slide
            // check init data
        },

        destroy: function () {
            this._showerListeners.offAll();
            this._showerContainerListeners.offAll();
            this._playerListeners.offAll();

            document.addEventListener('keydown', this._onKeyDown.bind(this));

            this._currentSlide = null;
            this._currentSlideNumber = null;
            this._documentTitle = null;
            this._shower = null;
        },

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
         * @returns {shower.Player}
         */
        first: function () {
            this.go(0);
            return this;
        },

        /**
         * @returns {shower.Player}
         */
        last: function () {
            this.go(this._shower.getSlidesCount() - 1);
            return this;
        },

        /**
         * @param {Number} index Slide index to activate.
         * @returns {shower.Player}
         */
        go: function (index) {
            var slidesCount = this._shower.getSlidesCount(),
                currentSlide = this._currentSlide;

            if (index != this._currentSlideNumber && index < slidesCount && index >= 0) {
                if (currentSlide && currentSlide.isActive()) {
                    currentSlide.deactivate();
                }

                currentSlide = this._shower.get(index);

                this._currentSlide = currentSlide;
                this._currentSlideNumber = index;

                if (!currentSlide.isActive()) {
                    currentSlide.activate();
                }

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
            this.go(index);
            this.events.emmit('slidechange');
        },

        _onSlideModeEnter: function () {
            var slideTitle = this._currentSlide.getTitle();
            if (slideTitle) {
                this._documentTitle = document.title;
                document.title = slideTitle;
            }
        },

        _onSlideModeExit: function () {
            if (this._documentTitle) {
                document.title = this._documentTitle;
                this._documentTitle = null;
            }
        },

        _onSlideAdd: function (e) {
            var slide = e.get('slide');

            slide.events
                .on('activate', this._onSlideActivate, this);
        },

        _onSlideRemove: function (e) {
            var slide = e.get('slide');

            slide.events
                .off('activate', this._onSlideActivate, this);
        },

        _onSlideActivate: function (e) {
            var slide = e.get('slide'),
                slideNumber = this._shower.getSlidesArray().indexOf(slide);

            this.go(slideNumber);
        },

        _onKeyDown: function (e) {
            if (!this._shower.isHotkeysEnabled()) {
                return;
            }

            switch (e.which) {
                case 33: // PgUp
                case 38: // Up
                case 37: // Left
                case 72: // H
                case 75: // K
                    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
                    e.preventDefault();
                    this.prev();
                    break;

                case 34: // PgDown
                case 40: // Down
                case 39: // Right
                case 76: // L
                case 74: // J
                    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
                    e.preventDefault();
                    this.next();
                    break;

                case 36: // Home
                    e.preventDefault();
                    this.first();
                    break;

                case 35: // End
                    e.preventDefault();
                    this.last();
                    break;

                case 9: // Tab (Shift)
                case 32: // Space (Shift)
                    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
                    e.preventDefault();

                    if (e.shiftKey) {
                        this.prev();
                    } else {
                        this.next();
                    }
                    break;
            }
        }
    });

    provide(Player);
});
