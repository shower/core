/**
 * @class
 * @name Next
 *
 * Next plugin for Shower
 *
 * @param {Shower} shower
 * @param {Object} [opts] Plugin options.
 * @param {String} [opts.selector = '.next']
 */
class Next {
    constructor(shower, opts) {
        this._shower = shower;
        this._elements = [];
        this._elementsSel = opts.selector || '.next';
        this._innerComplete = 0;

        this._setupListeners();
        if (this._shower.player.getCurrentSlideIndex() !== -1) {
            this._onSlideActivate();
        }
    }

    get stepsCount() {
        return this._elements.length;
    }

    get canGoNext() {
        return this._shower.container.isSlideMode()
            && this._innerComplete < this.stepsCount;
    }

    get canGoPrev() {
        return this._shower.container.isSlideMode()
            && this._innerComplete > 0;
    }

    _setupListeners() {
        this._showerListeners = this._shower.events.group()
            .on('destroy', this._destroy.bind(this));

        this._playerListeners = this._shower.player.events.group()
            .on('activate', this._onSlideActivate.bind(this))
            .on('next', this._onNext.bind(this))
            .on('prev', this._onPrev.bind(this));
    }

    _onSlideActivate() {
        this._elements = this._getElements();
        this._innerComplete = this._getInnerComplete();
    }

    _getElements() {
        const { layout } = this._shower.player.getCurrentSlide();
        const slideEl = layout.getElement();

        return [...slideEl.querySelectorAll(this._elementsSel)];
    }

    _getInnerComplete() {
        return this._elements
            .filter(el => el.classList.contains('active'))
            .length;
    }

    _onNext(event) {
        if (this.canGoNext) {
            this._innerComplete++;
            this._toggleActive();

            event.preventDefault();
        }
    }

    _onPrev(event) {
        if (this.canGoPrev) {
            this._innerComplete--;
            this._toggleActive();

            event.preventDefault();
        }
    }

    _toggleActive() {
        this._elements.forEach((el, index) => {
            el.classList.toggle('active', index < this._innerComplete);
        });
    }

    _destroy() {
        this._clearListeners();

        this._shower = null;
        this._elements = null;
        this._elementsSel = null;
        this._innerComplete = null;
    }

    _clearListeners() {
        this._showerListeners.offAll();
        this._playerListeners.offAll();
    }
}

export default Next;
