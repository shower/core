/**
 * @fileOverview
 * Layout factory for slides.
 */
modules.define('slide.layoutFactory', [
    'slide.Layout',
    'util.extend'
], function (provide, SlideLayout, extend) {

    /**
     * @name slide.layoutFactory
     */
    function layoutFactory () {}

    extend(layoutFactory.prototype, /** @lends slide.layoutFactory.prototype */ {
        /**
         * @param {Object} [parameters]
         * @param {String} [parameters.content] Slide content.
         * @param {String} [parameters.contentType='slide'] Cover, slide, image.
         * @returns {slide.Layout}
         */
        createLayout: function (parameters) {
            parameters = parameters || {};

            var element = this._createElement(extend({
                content: '',
                contentType: 'slide'
            }, parameters));

            return new SlideLayout(element);
        },

        _createElement: function (options) {
            var element = document.createElement('section');
            element.innerHTML = options.content;
            element.classList.add(options.contentType);

            return element;
        }
    });

    provide(layoutFactory);
});
