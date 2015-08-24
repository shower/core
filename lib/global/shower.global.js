modules.define('shower.global', [
    'Emitter',
    'Plugins',
    'util.extend'
], function (provide, EventEmitter, Plugins, extend) {

    var inited = [];

    /**
     * @class
     * @name shower
     * @static
     */
    var shower = {
        /**
         * Ready function will call callback when Shower init.
         * If Shower already initialized, callback will call immediately.
         *
         * @param {function} [callback] Your function that run after Shower initialized.
         * It will be call with shower.
         * @returns {boolean} Ready state.
         *
         * @example
         * shower.ready(function (sh) {
         *     sh.go(2);
         * });
         */
        ready: function (callback) {
            if (callback) {
                if (inited.length) {
                    inited.forEach(callback);
                } else {
                    this.events.once('init', function (e) {
                        callback(e.get('shower'));
                    });
                }
            }

            return Boolean(inited.length);
        },

        /**
         * Init new Shower.
         * @param {object} [initOptions]
         * @param {(HTMLElement|string)} [initOptions.container='.shower']
         * @param {object} [initOptions.options]
         * @param {function} [initOptions.callback]
         * @param {object} [initOptions.context]
         *
         * @example
         * shower.init({
         *     contaner: '.my-shower',
         *     callback: this._onShowerInit,
         *     context: this
         * });
         */
        init: function (initOptions) {
            initOptions = initOptions || {};

            var _this = this;
            modules.require(['Shower'], function (Shower) {
                var showerInstance = new Shower(initOptions.container, initOptions.options);
                inited.push(showerInstance);
                _this.events.emit('init', {shower: showerInstance});

                if (initOptions.callback) {
                    initOptions.callback.call(initOptions.context, showerInstance);
                }
            });
        },

        /**
         * @returns {Shower[]} Array of shower players.
         */
        getInited: function () {
            return inited;
        }
    };

    /**
     * @name shower.plugins
     * @field
     * @type {Plugins}
     */
    shower.events = new EventEmitter({context: shower}),

    /**
     * @name shower.events
     * @field
     * @type {Emitter}
     */
    shower.plugins = new Plugins(shower),

    provide(shower);
});
