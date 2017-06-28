import {EventEmitter} from '../emitter';

/**
 * @class
 * @name plugin.Next
 *
 * Next plugin for Shower
 *
 * @param {Shower} shower
 * @param {Object} [options] Plugin options.
 * @param {String} [options.selector = '.next']
 */
class Next {
    constructor(shower, options = {}) {
        this.events = new EventEmitter({context: this});

        this._shower = shower;
        this._elementsSelector = options.selector || '.next';
        this._elements = [];

        this._innerComplete = 0;

        this._setupListeners();
        if (this._shower.player.getCurrentSlideIndex() !== -1) {
            this._onSlideActivate();
        }
    }

    destroy() {
        this._clearListeners();

        this._elements = null;
        this._elementsSelector = null;
        this._innerComplete = null;
        this._shower = null;
    }

    /**
     * Activate next inner item.
     * @return {plugin.Next}
     */
    next() {
        if (!this._elements.length) {
            throw new Error('Inner nav elements not found.');
        }

        this._innerComplete++;
        this._go();

        this.events.emit('next');

        return this;
    }

    prev() {
        if (!this._elements.length) {
            throw new Error('Inner nav elements not found.');
        }

        this._innerComplete--;
        this._go();

        this.events.emit('prev');

        return this;
    }

    /**
     * @returns {Number} Inner elements count.
     */
    getLength() {
        this._elements = this._getElements();
        return this._elements.length;
    }

    /**
     * @returns {Number} Completed inner elements count.
     */
    getComplete() {
        return this._innerComplete;
    }

    _setupListeners() {
        this._showerListeners = this._shower.events.group()
            .on('destroy', this.destroy, this);

        this._playerListeners = this._shower.player.events.group()
            .on('activate', this._onSlideActivate, this)
            .on('next', this._onNext, this)
            .on('prev', this._onPrev, this);

        const timerPluginName = 'shower-timer';
        const timerPlugin = this._shower.plugins.get(timerPluginName);
        if (timerPlugin) {
            this._setupTimerPluginListener();
        } else {
            this._pluginsListeners = this._shower.plugins.events.group()
                .on('add', event => {
                    if (event.get('name') === timerPluginName) {
                        this._setupTimerPluginListener();
                        this._pluginsListeners.offAll();
                    }
                });
        }
    }

    _setupTimerPluginListener(plugin) {
        plugin.events.on('next', this._onNext, this, 100);
    }

    _clearListeners() {
        this._showerListeners.offAll();
        this._playerListeners.offAll();

        if (this._pluginsListeners) {
            this._pluginsListeners.offAll();
        }
    }

    _getElements() {
        const {layout} = this._shower.player.getCurrentSlide();
        const slideEl = layout.getElement();

        return [...slideEl.querySelectorAll(this._elementsSelector)];
    }

    _onNext(event) {
        const {length} = this._elements;
        const isSlideMode = this._shower.container.isSlideMode();

        if (length && isSlideMode && this._innerComplete < length) {
            event.preventDefault();
            this.next();
        }
    }

    _onPrev(event) {
        const {length} = this._elements;

        if (length && this._innerComplete && this._innerComplete < length) {
            event.preventDefault();
            this.prev();
        }
    }

    _go() {
        this._elements.forEach((element, index) => {
            element.classList.toggle('active', index < this._innerComplete);
        });
    }

    _onSlideActivate() {
        this._elements = this._getElements();
        this._innerComplete = this._getInnerComplete();
    }

    _getInnerComplete() {
        return this._elements
            .filter(el => el.classList.contains('active'))
            .length;
    }
}

export default Next;
