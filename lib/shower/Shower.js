/**
 * @file Core module of the Shower.
 */
modules.define('shower', [
    'Emitter',
    'shower.Container',
    'shower.parser',
    'shower.Player',
    'shower.Location',
    'shower.Plugins',
    'util.extend'
], function (provide, EventEmitter, Container, parser, Player, Location, Plugins, extend) {

    /**
     * @typedef {object} HTMLElement
     */

    /**
     * @typedef {function} ISlidesParseFunction
     * @param {HTMLElement} containerElement
     * @param {string} slide selector
     * @returns {Slide[]} slides
     */

    /**
     * @class
     * @name Shower
     *
     * Shower core.
     */
    function Shower () {
        this.events = new EventEmitter();
        this.options = {};

        this.plugins = new Plugins(this);
        this.container = null;
        this.player = null;

        this._slides = [];
        this._isReady = false;
        this._isHotkeysOn = true;
        this._liveRegion = null;
    }

    extend(Shower.prototype, /** @lends Shower.prototype */{
        /**
         * Init function.
         *
         * @param {(HTMLElement|string)} [containerElement = '.shower'] Container element or selector.
         * @param {object} [options] Shower options.
         * @param {boolean} [options.debug = false] Debug mode.
         * @param {boolean} [options.hotkeys = true] If true — hotkeys is work.
         * @param {string} [options.slide = '.shower > SECTION'] Slide selector.
         * @param {ISlidesParseFunction} [options.parser] Parse function.
         * @param {object} [options.plugins] Plugins options.
         * @returns {Shower}
         *
         * @example
         * modules.require(['shower'], function (shower) {
         *      shower.init(".mySlidesContainer", {
         *          slide: '.mySlidesContainer > SECTION',
         *          hotkeys: false
         *      });
         * });
         */
        init: function (containerElement, options) {
            containerElement = containerElement || '.shower';

            // Shower default options.
            this.options = extend({
                debug: false,
                hotkeys: true,
                slide: '.shower > SECTION',
                parser: parser,
                location: {
                    slideMode: 'full'
                },
                plugins: {}
            }, options);

            if (typeof containerElement == 'string') {
                containerElement = document.querySelector(containerElement);
            }

            this.container = new Container(this, containerElement);
            this.player = new Player(this);

            this._parseSlides();
            this._initLiveRegion();

            if (this.options.debug) {
                document.body.classList.add('debug');
                console.log('Debug mode on');
            }

            if (!this.options.hotkeys) {
                this.disableHotkeys();
            }

            this.location = new Location(this);

            this._isReady = true;
            this.events.emit('ready');

            return this;
        },

        /**
         * Destroy Shower.
         */
        destroy: function () {
            this.events.emit('destroy');

            this.location.destroy();
            this.container.destroy();
            this.player.destroy();
            this.plugins.destroy();

            this._slides.length = 0;
        },

        /**
         * Ready function will call callback when Shower init.
         * If Shower already initialized, callback will call immediately.
         *
         * @param {function} [callback] Your function that run after Shower initialized.
         * @returns {boolean} Ready state.
         */
        ready: function (callback) {
            if (callback) {
                if (this._isReady) {
                    callback();
                } else {
                    this.events.once('ready', callback);
                }
            }

            return this._isReady;
        },

        /**
         * Add slide or array of slides.
         *
         * @param {(Slide|Slide[])} slide Slide or array or slides.
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
         * Remove slide from shower.
         *
         * @param {(Slide|number)} slide Slide {@link Slide} or slide index.
         * @returns {Shower} Self link.
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

            slide = this._slides.splice(slidePosition, 1)[0];

            this.events.emit('slideremove', {
                slide: slide
            });

            slide.destroy();
            return this;
        },

        /**
         * Return slide by index.
         *
         * @param {number} index Slide index.
         * @returns {Slide} Slide by index.
         */
        get: function (index) {
            return this._slides[index];
        },

        /**
         * @returns {Slide[]} Array with slides {@link Slide}.
         */
        getSlidesArray: function () {
            return this._slides.slice();
        },

        /**
         * @returns {number} Slides count.
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

        /**
         * @borrows shower.Player.go
         * @returns {Shower}
         */
        go: function (index) {
            this.player.go(index);
            return this;
        },

        /**
         * Turn off hotkeys control.
         *
         * @returns {Shower}
         */
        disableHotkeys: function () {
            this._isHotkeysOn = false;
            return this;
        },

        /**
         * Turn on hotkeys control.
         *
         * @returns {Shower}
         */
        enableHotkeys: function () {
            this._isHotkeysOn = true;
            return this;
        },

        /**
         * @returns {boolean} Hotkeys is enabled.
         */
        isHotkeysEnabled: function () {
            return this._isHotkeysOn;
        },

        /**
         * @returns {HTMLElement} Live region element.
         */
        getLiveRegion: function () {
            return this._liveRegion;
        },

        /**
         * Update live region content.
         *
         * @param {string} content New content for live region.
         * @returns {Shower}
         */
        updateLiveRegion: function (content) {
            this._liveRegion.innerHTML = content;
            return this;
        },

        _parseSlides: function () {
            var slides = this.options.parser(this.container.getElement(), this.options.slide);
            this.add(slides);
        },

        _addSlide: function (slide) {
            slide.state.index = this._slides.length;
            this._slides.push(slide);

            // TODO: ?
            // slide.setParent(this);

            this.events.emit('slideadd', {
                slide: slide
            });
        },

        _initLiveRegion: function () {
            var liveRegion = document.createElement('section');
            liveRegion.setAttribute('role', 'region');
            liveRegion.setAttribute('aria-live', 'assertive');
            liveRegion.setAttribute('aria-relevant', 'additions');
            liveRegion.setAttribute('aria-label', 'Slide Content: Auto-updating');
            liveRegion.className = 'shower__live-region';

            document.body.appendChild(liveRegion);
            this._liveRegion = liveRegion;
        }
    });

    provide(new Shower());
});
