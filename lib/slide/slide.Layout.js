modules.define('slide.Layout', [
    'event.Emitter'
], function (provide, EventEmitter) {

    function Layout () {
        this.events = new EventEmitter();
        this.init();
    }

    Layout.prototype = {
        init: function () {

        },

        build: function () {
        },

        clear: function () {

        },

        // TODO: ?
        rebuild: function () {

        },

        setParentElement: function () {

        },

        getElement: function () {

        }
    };

    provide(Layout);
});
