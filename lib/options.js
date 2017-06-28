import {Store} from './utils';
import {EventEmitter} from './emitter';

/**
 * @class
 * @name Options
 * @augment Store
 * @param {object} [initOptions].
 *
 * Options manager.
 *
 * @example
 * var options = new Options({debug: false});
 *
 * options.get('debug'); // -> false
 * options.get('blabla', 'hello'); // -> 'hello'
 * options.get('hello'); // -> undefined
 */
class Options extends Store {
    constructor(...args) {
        super(...args);

        /**
         * Event emitter
         * @field
         * @type {EventEmitter}
         */
        this.events = new EventEmitter();
    }

    /**
     * @param {(string | object)} name Option name or object with key-value options to set.
     * @param {object} [value]
     * @returns {Options} Self.
     */
    set(name, value) {
        const items = [];
        const entries = typeof name === 'string' ?
            [[name, value]] :
            Object.entries(name || {});

        for (const [name, value] of Object.entries(entries)) {
            super.set(name, value);
            items.push({name, value});
        }

        if (items.length) {
            this.events.emit('set', {items});
        }

        return this;
    }

    unset(name) {
        super.unset(this, name);
        this.events.emit('unset', {name});

        return this;
    }
}

export default Options;
