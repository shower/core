modules.define('shower.Parser', [
    'Slide',
    'util.extend'
], function (provide, Slide, extend) {
    /**
     * @class
     * @name shower.Parser.
     * @param {HTMLElement} containerElement.
     */
    function Parser (containerElement) {
        this._containerElement = containerElement;
        this._parsedSlides = null;
    }

    extend(Parser.prototype, /** @lends shower.Parser.prototype */ {
        /**
         * @param {String} cssSelector Slide selector.
         * @returns {Slide[]} Slides.
         */
        parse: function (cssSelector) {
            var slides = [],
                slidesElements = this._containerElement.querySelectorAll(cssSelector);

            slidesElements = Array.prototype.slice.call(slidesElements);

            for (var i = 0, l = slidesElements.length; i < l; i++) {
                var slideElement = slidesElements[i],
                    slide = new Slide(slideElement);

                slides.push(slide);

                if (!slideElement.id) {
                    slideElement.id = i + 1;
                }
            }

            this._parsedSlides = slides;
            return slides;
        },

        /**
         * @returns {Slide[]|Null} Parsed slides.
         */
        getParsedSlides: function () {
            return this._parsedSlides;
        }
    });

    provide(Parser);
});
