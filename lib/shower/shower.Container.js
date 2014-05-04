modules.define('Container', [
    'event.Emitter'
], function (provide) { 

    /**
     *
     *
     */
    function Container (containerElement) {
        this.events = new EventEmitter();
        this._element = containerElement;
    }

    /** @lends Container.prototype */
    Container.prototype = {
        getElement: function () {
            return this._element;
        },

        setElement: function (containerElement) {
            this._element = containerElement;
        }
    };

    provide(Container);
});