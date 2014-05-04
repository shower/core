modules.define('event.Event', [

], function (provide) {

    function Event (data) {
        this._data = data;
        this._preventDefault = false;
        this._stopPropagation = false;
    }

    Event.prototype = {
        get: function (key) {
            return this._data[key];
        },

        preventDeafault: function () {
            this._preventDefault = true;
        },

        defaultPrevented: function () {
            return this._preventDafault;
        }

        stopImmediatePropagation: function () {
            this._stopPropagation = true;
        }
    };

    provide(Event);
});
