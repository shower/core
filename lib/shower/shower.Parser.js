modules.define('shower.parser', [
    'Slide'
], function (provide, Slide) {
    /**
     * @name shower.parser.
     * @function
     * @static
     * @param {HTMLElement} containerElement
     * @param {String} cssSelector
     * @returns {Slide[]}
     */
    function parse (containerElement, cssSelector) {
        var slides = [],
            slidesElements = containerElement.querySelectorAll(cssSelector);

        slidesElements = Array.prototype.slice.call(slidesElements);

        for (var i = 0, l = slidesElements.length; i < l; i++) {
            var slideElement = slidesElements[i],
                slide = new Slide(slideElement);

            if (!slideElement.id) {
                slideElement.id = i + 1;
            }

            slides.push(slide);
        }

        return slides;
    }

    provide(parse);
});
