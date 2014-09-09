modules.define('shower.Plugins', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    /**
     * @name shower.Plugins
     * @param {Shower} shower
     * @constructor
     */
    function Plugins (shower) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._plugins = {};
        this._waiting = [];

        this.init();
    }

    extend(Plugins.prototype, /** @lends shower.Plugins.prototype */ {

        init: function () {
            this._shower.events
                .once('ready', this._onShowerReady, this);
        },

        destroy: function () {
            this._plugins = null;
            this._waiting.length = 0;
            this._shower = null;
        },

        /**
         * @param {String} name
         * @param {Function} pluginClass
         * @param {Object} [pluginOptions]
         * @returns {shower.Plugins}
         */
        add: function (name, pluginClass, pluginOptions) {
            if (this._plugins[name]) {
                throw new Error('Plugin ' + name + ' already exist');
            }

            var plugin = {
                name: name,
                class: pluginClass,
                options: pluginOptions
            };

            if (this._shower.ready()) {
                this._initPlugin(plugin);
            } else {
                this._waiting.push(plugin);
            }

            return this;
        },

        /**
         * @param {String} name
         * @returns {shower.Plugins}
         */
        remove: function (name) {
            if (!this._plugins[name]) {
                throw new Error('Plugin ' + name + ' not found');
            }

            delete this._plugins[name];
            this.events.emit('pluginremove', {
                name: name
            });

            return this;
        },

        /**
         * @param {String} name
         * @returns {Function} Plugin.
         */
        get: function (name) {
            return this._plugins[name];
        },

        _initPlugin: function (plugin) {
            this._plugins[plugin.name] = new plugin.class(this._shower, plugin.options);
            this.events.emit('pluginadd', {
                name: plugin.name
            });
        },

        _onShowerReady: function () {
            if (this._waiting.length) {
                this._waiting.forEach(this._initPlugin);
            }
        }
    });

    provide(Plugins);
});