/**
 * @fileOverview
 */
modules.define('shower', [
    'event.Emitter',
    'shower.Container',
    'shower.parser',
    'shower.Player',
    'shower.History',
    'util.extend'
], function (provide, EventEmitter, Container, parser, Player, History, extend) {

    /**
     * @name Shower
     * @constructor
     */
    function Shower () {
        this.events = new EventEmitter();

        /**
         * Shower options.
         * @field
         * @type {Object}
         */
        this.options = {};
        this.container = null;

        this.player = null;

        this._history = null;
        this._slides = [];

        this._isReady = false;
    }

    extend(Shower.prototype, /** @lends Shower.prototype */{
        /**
         * Init shower.
         * @param {HTMLElement | String} containerElement Container element or selector.
         * @param {Object} [options] Shower options.
         * @param {Boolean} [options.debugMode = false]
         * @param {String} [options.slideSelector = '.shower--list > section'] Slide selector.
         * @param {Function} [options.parser] Function that gets as param {HTMLElement} containerElement,
         * {String} slideSelector and returns {Slide[]} slides.
         */
        init: function (containerElement, options) {
            this.options = extend({
                // Default options.
                debugMode: false,
                slideSelector: '.shower > section',
                parser: parser
            }, options);

            if (typeof containerElement == 'string') {
                containerElement = document.querySelector(containerElement);
            }

            this.container = new Container(this, containerElement);
            this.player = new Player(this);

            this._parseSlides();

            this._history = new History(this);

            if (this.options.debugMode) {
                document.body.classList.add('debug');
                console.log('Debug mode on');
            }

            this._isReady = true;
            this.events.emmit('ready');

            return this;
        },

        run: function () {
            var url = window.location;

            var currentSlideId = url.hash.substr(1);
            if (currentSlideId != '') {
                var slides = this.getSlidesArray();
                for (var i = slides.length - 1; i >= 0; i--) {
                    if (slides[i].getId() == currentSlideId) {
                        url.hash = '';
                        this.player.go(i);
                        break;
                    }
                }
            }

            if (/^full.*/.test(url.search.substr(1))) {
                this.container.enterSlideMode();
            }

            return this;
        },

        destroy: function () {
            this.events.emmit('destroy');

            this.container.destroy();
            this.player.destroy();

            this._slides.length = 0;
        },

        /**
         * @param {Function} callback
         */
        ready: function (callback) {
            if (this._isReady) {
                callback();
            } else {
                this.events.once('ready', callback);
            }

            return this;
        },

        /**
         * @param {Slide | Slide[]} slide
         * @returns {Shower}
         */
        add: function (slide) {
            if (Array.isArray(slide)) {
                for (var i = 0, k = slide.length; i < k; i++) {
                    this._addSlide(slide[i]);
                }
            } else {
                this._addSlide(slide);
            }

            return this;
        },

        /**
         * @param {Slide | Number} slide
         * @returns {Shower}
         */
        remove: function (slide) {
            var slidePosition;

            if (typeof slide == 'number') {
                slidePosition = slide;
            } else if (this._slides.indexOf(slide) != -1) {
                slidePosition = this._slides.indexOf(slide);
            } else {
                throw new Error('Slide not found');
            }

            slide = this._slides.splice(slidePosition, 1);

            this.events.emmit('slideremove', {
                slide: slide
            });

            slide.destroy();
            return this;
        },

        /**
         * @param {Number} index Slide index.
         * @returns {Slide} Slide by index.
         */
        get: function (index) {
            return this._slides[index];
        },

        /**
         * @returns {Slide[]}
         */
        getSlidesArray: function () {
            return this._slides.slice();
        },

        /**
         * @returns {Number} Slides count.
         */
        getSlidesCount: function () {
            return this._slides.length;
        },

        /**
         * @borrows shower.Player.next
         * @returns {Shower}
         */
        next: function () {
            this.player.next();
            return this;
        },

        /**
         * @borrows shower.Player.prev
         * @returns {Shower}
         */
        prev: function () {
            this.player.prev();
            return this;
        },

        /**
         * @borrows shower.Player.first
         * @returns {Shower}
         */
        first: function () {
            this.player.first();
            return this;
        },

        /**
         * @borrows shower.Player.last
         * @returns {Shower}
         */
        last: function () {
            this.player.last();
            return this;
        },

        go: function (index) {
            this.player.go(index);
            return this;
        },

        _parseSlides: function () {
            var slides = this.options.parser(this.container.getElement(), this.options.slideSelector);
            this.add(slides);
        },

        _addSlide: function (slide) {
            this._slides.push(slide);

            // TODO: ?
            // slide.setParent(this);

            this.events.emmit('slideadd', {
                slide: slide
            });
        }
    });

    provide(new Shower());
});
