modules.define('event.Event', [
    'util.extend'
], function (provide, extend) {

    function Event (data) {
        this._data = data;
        this._preventDefault = false;
        this._stopPropagation = false;
    }

    extend(Event.prototype, {
        get: function (key) {
            return this._data[key];
        },

        preventDeafault: function () {
            this._preventDefault = true;
        },

        defaultPrevented: function () {
            return this._preventDafault;
        }
    });

    provide(Event);
});
