modules.define('event.Event', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * @name event.Event
     * @param {Object} data
     * @constructor
     */
    function Event (data) {
        this._data = data;
        this._preventDefault = false;
        this._stopPropagation = false;
    }

    extend(Event.prototype, /** @lends event.Event.prototype */{
        /**
         * @param {String} key
         * @returns {Object}
         */
        get: function (key) {
            return this._data[key];
        },

        preventDefault: function () {
            return this._preventDefault = true;
        },

        defaultPrevented: function () {
            return this._preventDefault;
        },

        stopPropagation: function () {
            return this._stopPropagation = true;
        },

        isPropagationStopped: function () {
            return this._stopPropagation;
        }
    });

    provide(Event);
});
