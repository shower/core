modules.define('util.Storage', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class Simple key-value storage.
     * @name util.Storage
     */
    function Storage () {
        this._data = {};
    }

    extend(Storage.prototype, /** @lends util.Storage */{
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
    });

    provide(Storage);
});
