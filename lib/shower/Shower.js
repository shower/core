/**
 * @fileOverview
 */
modules.define('shower', [
    'event.Emitter',
    'shower.Container',
    'shower.Parser',
    'shower.Player',
    'util.extend'
], function (provide, EventEmitter, Container, Parser, Player, extend) {

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

        this._slideParser = null;
        this._slides = [];

        this._isReady = false;
    }

    extend(Shower.prototype, /** @lends Shower.prototype */{
        /**
         * Init shower.
         * @param {HTMLElement} containerElement
         * @param {Object} [options] Shower options.
         * @param {String} [options.slideSelector = '.shower--list > section'] Slide selector.
         */
        init: function (containerElement, options) {
            this.options = extend({
                //default options
                slideSelector: '.shower--list > section',
                parser: Parser
            }, options);

            this.container = new Container(containerElement);
            this.player = new Player(this);

            this._slideParser = new this.options.parser(containerElement);

            this._parseSlides();

            this._isReady = true;
            this.events.emmit('ready');
        },

        destroy: function () {
            this.container.destroy();
            this.player.destroy();

            this._slides.length = 0;
        },

        /**
         * @returns {Boolean}
         */
        isReady: function () {
            return this._isReady;
        },

        /**
         * @param {Slide | Slide[]} slide
         * @returns {Shower}
         */
        add: function (slide) {
            if (Array.isArray(slide)) {
                for (var i = 0, k = slide.length; i < k; i++) {
                    this._slides.push(slide[i]);
                }
            } else {
                this._slides.push(slide);
            }

            // TODO: ?
            // slide.setParent(this);

            this.events.emmit('slideadd');
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
            slide.destroy();

            this.events.emmit('slideremove');

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
         */
        next: function () {
            this.player.next();
        },

        /**
         * @borrows shower.Player.prev
         */
        prev: function () {
            this.player.prev();
        },

        _parseSlides: function () {
            this.add(this._slideParser.parse(this.options.slideSelector));
        }
    });

    provide(new Shower());
});
