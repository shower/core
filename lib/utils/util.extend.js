modules.define('util.extend', function (provide) {

    /**
     * @param {Object} target
     * @param {Object} source
     * @return {Object} Extended target object.
     */
    function extend (target) {
        if (!target) {
            throw new Error('util.extend: Target not found');
        }
        for (var i = 1, l = arguments.length; i < l; i++) {
            var obj = arguments[i];
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    target[property] = obj[property];
                }
            }
        }
        return target;
    }

    provide(extend);
});
