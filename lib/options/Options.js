/**
 * @fileOverview Options manager.
 */
modules.define('Options', [
    'Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

    /**
     * @class
     * @name  Options
     * @param {Object} [initOptions].
     *
     * @example
     * var options = new Options({debug: false});
     *
     * options.get('debug'); // -> false
     * options.get('blabla', 'hello'); // -> 'hello'
     * options.get('hello'); // -> undefined
     */
    function Options(initOptions) {
        this._options = typeof initOptions !== 'undefined' ?
            extend({}, initOptions) : {};

        /**
         * Event emitter
         * @field
         * @type {EventEmitter}
         */
        this.events = new EventEmitter();
    }

    extend(Options.prototype, /**@lends Options.prototype */{
        /**
         * @param {string} name Option name.
         * @param {object} [defaultValue] Default value which returns if option not definded.
         * @returns {object}
         */
        get: function (name, defaultValue) {
            return this._options.hasOwnProperty(name) ?
                this._options[name] :
                defaultValue;
        },

        /**
         * @returns {object} All contains options.
         */
        getAll: function () {
            return extend({}, this._options);
        },

        /**
         * @param {(string | object)} name Option name or object with key-value options to set.
         * @param {object} [value]
         * @returns {Options} Self.
         */
        set: function (name, value) {
            var changed = [];
            if (typeof name === 'string') {
                this._options[name] = value;
                changed.push({
                    name: name,
                    value: value
                });

            } else {
                var options = name || {};
                for (var optionName in options) {
                    if (options.hasOwnProperty(optionName)) {
                        this._options[optionName] = options[optionName];
                        changed.push({
                            name: optionName,
                            value: options[optionName]
                        });
                    }
                }
            }

            if (changed.length) {
                this.events.emit('set', {items: changed});
            }

            return this;
        },

        /**
         * @param {string} name
         * @returns {Options} Self.
         */
        unset: function (name) {
            if (!this._options.hasOwnProperty(name)) {
                throw new Error('Option ' + name + ' not found.');
            }

            delete this._options[name];

            this.events.emit('unset', {name: name});
            return this;
        },

        destroy: function () {
            this._options = {};
        }
    });

    provide(Options);
});
