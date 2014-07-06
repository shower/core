modules.define('util.Storage', [], function (provide) {

    /**
     * Simple key-value storage.
     * @name util.Storage
     */
    function Storage () {
        this._data = {};
    }

    Storage.prototype = {
        /**
         * @param {String} key
         * @param {Object} value
         * @returns {util.Storage}
         */
        add: function (key, value) {
            this._data[key] = value;
            return this;
        },

        /**
         * @param {String} key
         * @returns {util.Storage}
         */
        remove: function (key) {
            delete this._data[key];
            return this;
        },

        /**
         * @param {String | Object} key
         * @returns {Object}
         */
        get: function (key) {
            return typeof key == 'string' ? this._data[key] : key;
        }
    };

    provide(Storage);
});
