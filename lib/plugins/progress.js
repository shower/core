/**
 * @class
 * @name Progress
 *
 * Progress plugin for shower.
 *
 * @param {Shower} shower
 * @param {Object} [opts] Plugin opts.
 * @param {String} [opts.selector = '.progress']
 */
class Progress {
    constructor(shower, opts) {
        this._shower = shower;
        this._elementSelector = opts.selector || '.progress';

        const containerEl = this._shower.container.getElement();
        const el = containerEl.querySelector(this._elementSelector);
        if (el) {
            el.setAttribute('role', 'progressbar');
            el.setAttribute('aria-valuemin', 0);
            el.setAttribute('aria-valuemax', 100);

            this._element = el;
            this._updateProgress();
        }

        this._setupListeners();
    }

    _updateProgress() {
        const total = this._shower.getSlidesCount();
        const current = this._shower.player.getCurrentSlideIndex();
        const progress = (100 / (total - 1)) * current;

        this._element.style.width = `${progress}%`;
        this._element.setAttribute('aria-valuenow', progress);
        this._element.setAttribute('aria-valuetext', `Slideshow progress: ${progress}%`);
    }

    _setupListeners() {
        if (this._element) {
            this._playerListeners = this._shower.player.events.group()
                .on('activate', this._updateProgress, this);
        }

        this._showerListeners = this._shower.events.group()
            .on('destroy', this._destroy, this);
    }

    _destroy() {
        this._shower = null;
        this._elementSelector = null;
        this._element = null;
        this._clearListeners();
    }

    _clearListeners() {
        if (this._playerListeners) {
            this._playerListeners.offAll();
        }

        this._showerListeners.offAll();
    }
}

export default Progress;
