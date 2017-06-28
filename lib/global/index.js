import {EventEmitter} from '../emitter';
import Plugins from '../plugins';
import Shower from '../shower';

const inited = [];

/**
 * @class
 * @name shower
 * @static
 */
const sh = {
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
    ready(callback) {
        if (callback) {
            if (inited.length) {
                inited.forEach(callback);
            } else {
                this.events.once('init', event => {
                    callback(event.get('shower'));
                });
            }
        }

        return Boolean(inited.length);
    },

    /**
     * Init new Shower.
     * @param {object} [opts]
     * @param {(HTMLElement|string)} [opts.container='.shower']
     * @param {object} [opts.options]
     * @param {function} [opts.callback]
     * @param {object} [opts.context]
     *
     * @example
     * shower.init({
     *     contaner: '.my-shower',
     *     callback: this._onShowerInit,
     *     context: this,
     * });
     */
    init(opts = {}) {
        // eslint-disable-next-line no-new
        new Shower(opts.container, opts.options);
    },

    /**
     * @returns {Shower[]} Array of shower players.
     */
    getInited() {
        return inited.slice();
    },
};

/**
 * @name shower.events
 * @field
 * @type {EventEmitter}
 */
sh.events = new EventEmitter({context: sh});

/**
 * @name shower.plugins
 * @field
 * @type {Plugins}
 */
sh.plugins = new Plugins(sh);

sh.events.on('notify', event => {
    const shower = event.get('shower');
    inited.push(shower);
    sh.events.emit('init', event);
});

export default sh;
