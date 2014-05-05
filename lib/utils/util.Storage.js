modules.define('util.Storage', [], function (provide) {

    /**
     * key-value storage
     * @name util.Storage
     */
    function Storage () {
        this._data = {};
    }

    Storage.prototype = {
        /**
         * @param {String} key
         * @param {Object} value
         */
        add: function (key, value) {
            this._data[key] = value;
            return this;
        },

        /**
         * @param {String} key
         */
        remove: function (key) {
            delete this._data[key];
            return this;
        },

        /**
         * @param {String | Object} key
        get: function (key) {
            return typeof key == 'string' ? this._data[key] : key;
        }
    };

    provide(Storage);
});
