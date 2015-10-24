/**
 * @fileOverview Options manager.
 */
modules.define('Options', [
    'Emitter',
    'util.Store',
    'util.extend',
    'util.inherit'
], function (provide, EventEmitter, Store, extend, inherit) {

    /**
     * @class
     * @name Options
     * @augment util.Store
     * @param {object} [initOptions].
     *
     * @example
     * var options = new Options({debug: false});
     *
     * options.get('debug'); // -> false
     * options.get('blabla', 'hello'); // -> 'hello'
     * options.get('hello'); // -> undefined
     */
    function Options(initOptions) {
        Options.super.constructor.apply(this, arguments);
        /**
         * Event emitter
         * @field
         * @type {EventEmitter}
         */
        this.events = new EventEmitter();
    }

    inherit(Options, Store, {
        /**
         * @param {(string | object)} name Option name or object with key-value options to set.
         * @param {object} [value]
         * @returns {Options} Self.
         */
        set: function (name, value) {
            var changed = [];
            if (typeof name === 'string') {
                Options.super.set.call(this, name, value);
                changed.push({
                    name: name,
                    value: value
                });

            } else {
                var options = name || {};
                for (var optionName in options) {
                    if (options.hasOwnProperty(optionName)) {
                        var optionValue = options[optionName];
                        Options.super.set.call(this, name, optionValue);
                        changed.push({
                            name: optionName,
                            value: optionValue
                        });
                    }
                }
            }

            if (changed.length) {
                this.events.emit('set', {items: changed});
            }

            return this;
        },

        unset: function (name, value) {
            Options.super.unset(this, name, value);
            this.events.emit('unset', {name: name});

            return this;
        }
    });

    provide(Options);
});
