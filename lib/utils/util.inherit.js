modules.define("util.inherit", [
    "util.extend"
], function (provide, extend) {

    /**
     * Inherit function.
     * @name util.inherit
     * @function
     * @static
     * @param {Function} ChildClass
     * @param {Function} ParentClass
     * @param {Object} override
     * @returns {Object} Child class prototype.
     *
     * @example
     * function CrazySlide(content, options) {
     *      CrazySlide.super.constructor.call(this, content, options);
     *      …
     * }
     * inherit(CrazySlide, Slide, {
     *     _haveFun: function () {
     *         alert('fun');
     *     }
     * });
     */
    var inherit = function (ChildClass, ParentClass, override) {
        ChildClass.prototype = Object.create(ParentClass.prototype);
        ChildClass.prototype.constructor = ChildClass;
        ChildClass.super = ParentClass.prototype;
        ChildClass.super.constructor = ParentClass;

        if (override) {
            extend(ChildClass.prototype, override);
        }
        return ChildClass.prototype;
    };

    provide(inherit);
});
