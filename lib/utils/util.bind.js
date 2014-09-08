/**
 * @fileOverview
 * Simple bind without currying.
 */
modules.define('util.bind', [], function (provide) {

    /**
     * @static
     * @param {Function} fn Function.
     * @param {Object} ctx Context.
     */
    var bind = typeof Function.prototype.bind == 'function' ?
        function (fn, ctx) {
            return fn.bind(ctx);
        } :
        function (fn, ctx) {
            return function () {
                return fn.apply(ctx, arguments);
            }
        };

    provide(bind);
});