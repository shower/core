const isInteractiveEl = el => {
    return el.matches('video, audio, a, button, input');
};

/**
 * @class
 * Touch events plugin for shower.
 * @name Touch
 * @param {Shower} shower
 * @param {Object} [options] Plugin options.
 */
class Touch {
    constructor(shower) {
        this._shower = shower;
        this._setupListeners();
    }

    destroy() {
        this._clearListeners();
        this._shower = null;
    }

    _setupListeners() {
        this._showerListeners = this._shower.events.group()
            .on('add', this._onSlideAdd, this);

        this._bindedTouchStart = this._onTouchStart.bind(this);
        this._bindedTouchMove = this._onTouchMove.bind(this);

        this._shower.getSlides().forEach(this._addTouchStartListener, this);
        document.addEventListener('touchmove', this._bindedTouchMove, true);
    }

    _clearListeners() {
        this._showerListeners.offAll();
        this._shower.getSlides().forEach(this._removeTouchStartListener, this);
        document.removeEventListener('touchmove', this._bindedTouchMove);
    }

    _onSlideAdd(event) {
        const slide = event.get('slide');
        this._addTouchStartListener(slide);
    }

    _addTouchStartListener(slide) {
        const element = slide.layout.getElement();
        element.addEventListener('touchstart', this._bindedTouchStart);
    }

    _removeTouchStartListener(slide) {
        const element = slide.layout.getElement();
        element.removeEventListener('touchstart', this._bindedTouchStart);
    }

    _onTouchStart(event) {
        const isSlideMode = this._shower.container.isSlideMode();
        const slide = this._getSlideByElement(event.currentTarget);
        if (!slide) return;

        if (isSlideMode) {
            if (isInteractiveEl(event.target)) return;

            event.preventDefault();
            const [{pageX}] = event.touches;

            if (pageX > innerWidth / 2) {
                this._shower.player.next();
            } else {
                this._shower.player.prev();
            }
        } else {
            // Go and turn on slide mode.
            slide.activate();
        }
    }

    _onTouchMove(event) {
        if (this._shower.container.isSlideMode()) {
            event.preventDefault();
        }
    }

    _getSlideByElement(el) {
        const slides = this._shower.getSlides();

        return slides.find(slide => el.id === slide.getId());
    }
}

export default Touch;
