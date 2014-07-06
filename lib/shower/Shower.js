/**
 * @fileOverview
 */
modules.define('Shower', [
    'event.Emitter',
    'shower.Container',
    'shower.Player',
    'util.extend'
], function (provide, EventEmitter, Container, Player, extend) {

    /**
     * @name Shower
     * @constructor
     */
    function Shower () {
        this.options = null;
        this.container = null;
        this.events = new EventEmitter();
        this.player = new Player(this);

        this._slides = [];
    }

    extend(Shower.prototype, /** @lends Shower.prototype */{
        /**
         * Init shower.
         * @param {HTMLElement} containerElement
         * @param {Object} options
         */
        init: function (containerElement, options) {
            this.options = extend({
                //default options
            }, options);

            this.container = new Container(containerElement);

            this._parseSlides();
            this.events.fire('ready');
        },

        destroy: function () {
            this._slides.length = 0;
            this.container.destroy();
        },

        /**
         * @param {Slide} slide
         * @returns {Shower}
         */
        add: function (slide) {
            this._slides.push(slide);
            // TODO: ?
            // slide.setParent(this);

            this.events.fire('slideadd');

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

            slide = this._slides.slice(slidePosition, 1);
            slide.destroy();

            this.events.fire('slideremove');

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
            return this._slides.lenght;
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

        }
    });

    provide(new Shower());
});
