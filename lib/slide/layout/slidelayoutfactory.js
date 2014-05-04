/**
 * @fileOverview
 */
module.define('slideLayoutFactory', [
    'slide.HtmlLayout',
    'util.extend'
], function (provide, HtmlLayout, extend) {
    
    function slideLayoutFactory () {}
    extend(slideLayoutFactory.prototype, {
        /**
         * @param {String} type
         * @returns {slide.Layout} 
         */
        createClass: function (type) {
            var layoutClass;

            switch (type) {
                case 'html': 
                    layoutClass = HtmlLayout;
                    break;
                default: 
                    layoutClass = HtmlLayout;
                    break; 
            }
            return layoutClass;
        }
    });

    provide(slideLayoutFactory);
});