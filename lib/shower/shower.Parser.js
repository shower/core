modules.define('shower.Parser', [
    'Slide',
    'util.dom',
    'util.extend'
], function (provide, Slide, utilDom, extend) {

    var slideSelector = '.slide';

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
         * @returns {Slide[]} Slides.
         */
        parse: function () {
            return this._getSlides();
        },

        /**
         * @returns {Slide[]|Null} Parsed slides.
         */
        getParsedSlides: function () {
            return this._parsedSlides;
        },

        _getSlides: function () {
            var slides = [],
                slidesElements = utilDom.findAll(slideSelector, this._containerElement);

            slidesElements = Array.prototype.slice.call(slidesElements);

            for (var i = 0, l = slidesElements.length; i < l; i++) {
                var slide = new Slide(slidesElements[i]),
                    slideLayout = slide.getLayout();

                slides.push(slide);

                if (!slideLayout.getElementId()) {
                    slideLayout.setElementId(i + 1);
                }
            }

            this._parsedSlides = slides;
            return slides;
        }
    });

    provide(Parser);
});
