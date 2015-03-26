/**
 * @file Plugins controller for Shower.
 */
modules.define('shower.Plugins', [
    'Emitter',
    'util.bind',
    'util.extend'
], function (provide, EventEmitter, bind, extend) {

    /**
     * @class
     * @name shower.Plugins
     *
     * Plugins controller for Shower.
     *
     * @param {Shower} shower
     */
    function Plugins (shower) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._isReady = false;
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
         * Add plugin to the Shower plugins system.
         * After add plugin, auto:
         * — instance plugin;
         * — call init method for setup plugin.
         *
         * @param {string} name Plugin module name.
         * @param {object} [pluginOptions] Custom options for plugin.
         * @returns {shower.Plugins}
         */
        add: function (name, pluginOptions) {
            if (this._plugins[name]) {
                throw new Error('Plugin ' + name + ' already exist');
            }

            // If options not found, get defaults options from Shower plugin options.
            var plugin = {
                name: name,
                options: pluginOptions
            };

            this._requirePlugin(plugin);
            return this;
        },

        /**
         * Remove plugin from system.
         *
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
         * Get plugin by name.
         *
         * @param {string} name Plugin name.
         * @returns {object} Plugin.
         */
        get: function (name) {
            return this._plugins[name];
        },

        _addPlugin: function (plugin) {
            if (this._isReady) {
                this._instancePlugins(plugin);
            } else {
                this._waiting.push(plugin);
            }
        },

        _instancePlugins: function (pluginInfo) {
            var name = pluginInfo.name,
                showerOptions = this._shower.options,
                // If options not found, get defaults options from Shower plugin options.
                options = pluginInfo.options || showerOptions.plugins && showerOptions.plugins[name],
                plugin = new pluginInfo.class(this._shower, options);

            this._plugins[name] = plugin;

            this.events.emit('pluginadd', {
                name: name
            });

            if (this._isReady) {
                setTimeout(function () {
                    plugin.init();
                }, 0);
            }
        },

        _onShowerReady: function () {
            this._isReady = true;
            
            if (this._waiting.length) {
                this._waiting.forEach(this._instancePlugins, this);
                this._initPlugins();
            }
        },

        _initPlugins: function () {
            var plugins = this._plugins;
            for (var pluginName in plugins) {
                if (plugins.hasOwnProperty(pluginName)) {
                    plugins[pluginName].init();
                }
            }
        },

        _requirePlugin: function (plugin) {
            modules.require([plugin.name], bind(function (pluginClass) {

                extend(plugin, {
                    class: pluginClass
                });

                this._addPlugin(plugin);
            }, this));
        }
    });

    provide(Plugins);
});
