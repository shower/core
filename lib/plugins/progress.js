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
    constructor(shower, opts = {}) {
        this._shower = shower;
        this._playerListeners = null;

        this._element = null;
        this._elementSelector = opts.selector || '.progress';

        const containerEl = this._shower.container.getElement();
        this._element = containerEl.querySelector(this._elementSelector);
        if (!this._element) return;

        this._setupListeners();

        this._element.setAttribute('role', 'progressbar');
        this._element.setAttribute('aria-valuemin', 0);
        this._element.setAttribute('aria-valuemax', 100);

        this.updateProgress();
    }

    destroy() {
        this._clearListeners();
        this._shower = null;
    }

    updateProgress() {
        const total = this._shower.getSlidesCount();
        const current = this._shower.player.getCurrentSlideIndex();
        const progress = (100 / (total - 1)) * current;

        if (!this._element) return;

        this._element.style.width = `${progress}%`;
        this._element.setAttribute('aria-valuenow', progress);
        this._element.setAttribute('aria-valuetext', `Slideshow Progress: ${progress}%`);
    }

    _setupListeners() {
        this._showerListeners = this._shower.events.group()
            .on('destroy', this.destroy, this);

        this._playerListeners = this._shower.player.events.group()
            .on('activate', this._onSlideChange, this);
    }

    _clearListeners() {
        if (this._showerListeners) {
            this._showerListeners.offAll();
        }
        if (this._playerListeners) {
            this._playerListeners.offAll();
        }
    }

    _onSlideChange() {
        this.updateProgress();
    }
}

export default Progress;
