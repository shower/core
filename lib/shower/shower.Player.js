modules.define('shower.Player', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    function Player () {
        this.events = new EventEmitter();
        this._currentSlideNumber = 0;
    }

    extend(Player.prototype, {
        next: function () {
            this.events.fire('next');
        },

        prev: function () {
            this.events.fire('prev');
        },

        play: function (options) {

            this.events.fire('play');
        },

        stop: function () {

            this.events.fire('stop');
        }
    });

    provide(Player);
});
