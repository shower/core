modules.define('util.bind', [

], function (provide) {

    /**
     * @static
     * @name util.bind
     * @param {Function} func
     * @param {Object} context
     */
    var bind = Function.prototype.bind ? 
        function (func, context) {
            return func.bind(context);
        } : 
        function (func, context) {
            return function () {
                return func.apply(context, arguments);
            }
        }

    provide(bind);
});