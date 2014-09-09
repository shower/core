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
         * @param {Function|String} pluginClass Class or plugin module name.
         * @param {Object} [pluginOptions]
         * @returns {shower.Plugins}
         */
        add: function (name, pluginClass, pluginOptions) {
            if (this._plugins[name]) {
                throw new Error('Plugin ' + name + ' already exist');
            }

            // If options not found, get defaults options from Shower plugin options.
            var options = pluginOptions || this._shower.options.plugins[name],
                plugin = {
                    name: name,
                    class: pluginClass,
                    options: options
                };

            if (typeof pluginClass == 'string') {
                this._requirePlugin(plugin);
            } else {
                this._addPlugin(plugin);
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

        _addPlugin: function (plugin) {
            if (this._shower.ready()) {
                this._initPlugin(plugin);
            } else {
                this._waiting.push(plugin);
            }
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
        },

        _requirePlugin: function (plugin) {
            modules.require([plugin.name], bind(function (pluginClass) {
                this._addPlugin(extend(plugin, {
                    class: pluginClass
                }));
            }, this));
        }
    });

    provide(Plugins);
});