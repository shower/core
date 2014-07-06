/**
 * @fileOverview
 * Layout factory for slides.
 */
modules.define('slide.layoutFactory', [
    'util.dom',
    'util.extend'
], function (provide, utilDom, extend) {

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

            return new Slide(element);
        },

        _createElement: function (options) {
            return utilDom.create({
                tag: 'section',
                content: options.content,
                attrs: {
                    'class': options.contentType
                }
            });
        }
    });

    provide(layoutFactory);
});
