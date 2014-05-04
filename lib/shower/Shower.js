/**
 * @fileOverview
 */ 
modules.define('Shower', [
    'event.Emitter',
    'Container'
], function (provide, Container) {

    /**
     * 
     * @param {HTMLElement} containerElement
     * @param {Object} options
     */
    function Shower (containerElement, options) {
        this.options = extend({
            //defauilt options
        }, options);
        this.events = new EventEmitter();
        this.container = new Container(containerElement);
        this.player = new Player();

        this._slides = [];
        this._activeSlide = null;
    }

    /** @lends Shower.prototype */
    Shower.prototype = {
        init: function () {
            this._parseSlides();

            this.events.fire('ready');
        },

        destroy: function () {

        },

        /**
         * @param {Slide} slide
         */
        add: function (slide) {
            this._slides.push(slide);
            // TODO: ? 
            // slide.setParent(this);

            this.events.fire('slideadd');
        },

        /** 
         * @param {Slide | Number}
         */
        remove: function (slide) {
            var slide,
                slidePosition;

            if (typeof slide == 'number') {
                slidePosition = slide;
            } else if (this._slides.indexOf(slide) != -1) { 
                slidePosition = this._slides.indexOf(slide);
            } else {
                console.error('Slide not found'); 
            }

            slide = this._slides.slice(slidePosition, 1);
            slide.destroy();

            this.events.fire('slideremove')
        }, 

        getActive: function () {
            return this._activeSlide;
        },

        /**
         * {Number} slideNumber
         */
        setActive: function (slideNumber) {
            if (slideNumber < this._slides.lengths) {
                this._slides[slideNumber].setActive();
                this._activeSlide = slideNumber;

                this.events.fire('slideactvate', {
                    index: slideNumber;
                });
            }
        },

        next: function () {
            this.player.next();
        },

        prev: function () { 
            this.player.prev();
        },

        _parseSlides: function () {
            var slidesContainer = this.container.getElement();

        }
    };

    provide(Shower);
});
