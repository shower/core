modules.define('emitter.Event', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * @name event.Event
     *
     * Event class. Can contains custom data.
     *
     * @param {object} data Custom event data.
     */
    function Event (data) {
        this._data = data;
        this._preventDefault = false;
        this._stopPropagation = false;
    }

    extend(Event.prototype, /** @lends event.Event.prototype */{
        /**
         * @param {string} key
         * @returns {object}
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
