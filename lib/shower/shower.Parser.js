modules.define('shower.Parser', [
    'Slide',
    'util.dom',
    'util.extend'
], function (provide, Slide, utilDom, extend) {

    var slideSelector = 'section';

    /**
     * @name shower.Parser.
     * @param {Shower} shower.
     */
    function Parser (shower) {
        this._shower = shower;
        this._parsedSlides = null;
    }

    extend(Parser.prototype, /** @lends shower.Parser.prototype */ {
        parse: function () {
            var slides = this._getSlides();
            for (var i = 0, l = slides.length; i < l; i++) {
                this._shower.add(slides[i]);
            }
        },

        /**
         * @returns {Slide[]} Parsed slides.
         */
        getParsedSlides: function () {
            return this._parsedSlides;
        },

        _getSlides: function () {
            var slides = [],
                slidesElements = utilDom.findAll(this._shower.container.getElement(), slideSelector);

            slidesElements = [].slice.call(slidesElements);

            for (var i = 0, l = slidesElements.length; i < l; i++) {
                slides.push(new Slide(slidesElements[i]));
            }

            this._parsedSlides = slides;
            return slides;
        }
    });

    provide(Parser);
});
