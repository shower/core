/**
 * @file Simple bind without currying.
 */
modules.define('util.bind', [], function (provide) {

    /**
     * @name util.bind
     * @static
     * @function
     * @param {function} fn Function.
     * @param {object} ctx Context.
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
