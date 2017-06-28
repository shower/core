import {EventEmitter} from '../emitter';
import Plugins from '../plugins';

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
    init(initOptions) {
        initOptions = initOptions || {};

        shower.modules.require(['Shower'], function (Shower) {
            // eslint-disable-next-line no-new
            new Shower(initOptions.container, initOptions.options);
        });
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

sh.events.on('notify', function (event) {
    const showerInstance = event.get('shower');
    inited.push(showerInstance);
    sh.events.emit('init', event);
});

export default sh;
