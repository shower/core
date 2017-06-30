import {EventEmitter} from '../emitter';

/**
 * @class
 * @name Timer
 *
 * Timer plugin for shower.
 *
 * @param {Shower} shower
 * @constructor
 */
class Timer {
    constructor(shower) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._timer = null;

        this._showerListeners = null;
        this._playerListeners = null;
        this._pluginsListeners = null;

        this._setupListeners();
    }

    destroy() {
        this._clearTimer();
        this._clearListeners();

        this._shower = null;
    }

    /**
     * @param {Integer} timing
     */
    run(timing) {
        this._initTimer(timing);
    }

    stop() {
        this._clearTimer();
    }

    _setupListeners() {
        this.events.on('next', this._onNext, this);

        this._showerListeners = this._shower.events.group()
            .on('destroy', this.destroy, this);

        this._playerListeners = this._shower.player.events.group()
            .on('keydown', this._clearTimer, this)
            .on('activate', this._onSlideActivate, this);

        const nextPluginName = 'shower-next';
        this._nextPlugin = this._shower.plugins.get(nextPluginName);
        if (!this._nextPlugin) {
            this._pluginsListeners = this._shower.plugins.events.group()
                .on('pluginadd', event => {
                    if (event.get('name') === nextPluginName) {
                        this._nextPlugin = this._shower.plugins.get(nextPluginName);
                        this._pluginsListeners.offAll();
                    }
                });
        }

        if (this._shower.player.getCurrentSlideIndex() !== -1) {
            this._onSlideActivate();
        }
    }

    _clearListeners() {
        this._showerListeners.offAll();
        this._playerListeners.offAll();
    }

    _onSlideActivate() {
        this._clearTimer();
        var currentSlide = this._shower.player.getCurrentSlide();

        if (this._shower.container.isSlideMode() && currentSlide.state.get('visited') < 2) {
            var timing = currentSlide.layout.getData('timing');

            if (timing && /^(\d{1,2}:)?\d{1,3}$/.test(timing)) {
                if (timing.includes(':')) {
                    timing = timing.split(':');
                    timing = (parseInt(timing[0], 10) * 60 + parseInt(timing[1], 10)) * 1000;
                } else {
                    timing = parseInt(timing, 10) * 1000;
                }

                if (timing !== 0) {
                    this._initTimer(timing);
                }
            }
        }
    }

    _initTimer(timing) {
        const next = this._nextPlugin;

        // Support Next plugin.
        if (next &&
            next.getLength() &&
            next.getLength() !== next.getComplete()) {

            timing /= next.getLength() + 1;
        }

        this._timer = setInterval(() => {
            this.events.emit('next');
        }, timing);
    }

    _clearTimer() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    _onNext() {
        this._clearTimer();
        this._shower.player.next();
    }
}

export default Timer;
