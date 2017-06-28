import {EventEmitter} from '../emitter';
import {bound} from '../utils';

const isInteractiveEl = el => {
    return el.matches('button, input, select, textarea');
};

/**
 * @class
 * @name Player
 *
 * Control slides.
 *
 * @param {Shower} shower Shower.
 */
class Player {
    constructor(shower) {
        this.events = new EventEmitter({
            context: this,
            parent: shower.events,
        });

        this._shower = shower;
        this._showerListeners = null;
        this._playerListeners = null;

        this._currentSlideNumber = -1;
        this._currentSlide = null;

        this.init();
    }

    init() {
        this._showerListeners = this._shower.events.group()
            .on('slideadd', this._onSlideAdd, this)
            .on('slideremove', this._onSlideRemove, this)
            .on('slidemodeenter', this._onSlideModeEnter, this);

        this._playerListeners = this.events.group()
            .on('prev', this._onPrev, this)
            .on('next', this._onNext, this)
            .on('prevslide', this._onPrev, this)
            .on('nextslide', this._onNext, this);

        document.addEventListener('keydown', bound(this, '_onKeyDown'));
    }

    destroy() {
        this._showerListeners.offAll();
        this._playerListeners.offAll();

        document.removeEventListener('keydown', bound(this, '_onKeyDown'));

        this._currentSlide = null;
        this._currentSlideNumber = null;
        this._shower = null;
    }

    /**
     * Go to next step.
     *
     * @returns {shower.Player}
     */
    next() {
        this.events.emit('next');
        return this;
    }

    /**
     * Go to previous step.
     *
     * @returns {shower.Player}
     */
    prev() {
        this.events.emit('prev');
        return this;
    }

    /**
     * Go to next slide.
     *
     * @returns {shower.Player}
     */
    nextSlide() {
        this.events.emit('nextslide');
        return this;
    }

    /**
     * Go to previous slide.
     *
     * @returns {shower.Player}
     */
    prevSlide() {
        this.events.emit('prevslide');
        return this;
    }

    /**
     * Go to first slide.
     *
     * @returns {shower.Player}
     */
    first() {
        this.go(0);
        return this;
    }

    /**
     * Go to last slide.
     *
     * @returns {shower.Player}
     */
    last() {
        this.go(this._shower.getSlidesCount() - 1);
        return this;
    }

    /**
     * Go to custom slide by index.
     *
     * @param {number | Slide} index Slide index to activate.
     * @returns {shower.Player}
     */
    go(index) {
        // If go by slide istance.
        if (typeof index !== 'number') {
            index = this._shower.getSlideIndex(index);
        }

        var slidesCount = this._shower.getSlidesCount();
        var slide = this._currentSlide;

        if (index !== this._currentSlideNumber && index < slidesCount && index >= 0) {
            if (slide && slide.isActive()) {
                slide.deactivate();
            }

            slide = this._shower.get(index);

            this._currentSlide = slide;
            this._currentSlideNumber = index;

            if (!slide.isActive()) {
                slide.activate();
            }

            this.events.emit('activate', {index, slide});
        }

        return this;
    }

    /**
     * @returns {Slide} Current active slide.
     */
    getCurrentSlide() {
        return this._currentSlide;
    }

    /**
     * @returns {Number} Current active slide index.
     */
    getCurrentSlideIndex() {
        return this._currentSlideNumber;
    }

    _onPrev() {
        this._changeSlide(this._currentSlideNumber - 1);
    }

    _onNext() {
        this._changeSlide(this._currentSlideNumber + 1);
    }

    /**
     * @ignore
     * @param {number} index Slide index.
     */
    _changeSlide(index) {
        this.go(index);
    }

    _onSlideAdd(event) {
        const slide = event.get('slide');
        slide.events.on('activate', this._onSlideActivate, this);
    }

    _onSlideRemove(event) {
        const slide = event.get('slide');
        slide.events.off('activate', this._onSlideActivate, this);
    }

    _onSlideActivate(event) {
        const slide = event.get('slide');
        const index = this._shower.getSlideIndex(slide);

        this.go(index);
    }

    _onKeyDown(event) {
        if (!this._shower.isHotkeysEnabled()) return;
        if (isInteractiveEl(event.target)) return;

        this.events.emit('keydown', {event});

        let action;
        let allowModifiers = false;

        switch (event.which) {
            case 33: // PgUp (Shift)
            case 38: // Up   (Shift)
            case 37: // Left (Shift)
            case 72: // H (Shift)
            case 75: // K (Shift)
            case 80: // P (Shift)
                action = event.shiftKey ? 'prevSlide' : 'prev';
                break;

            case 34: // PgDown (Shift)
            case 40: // Down   (Shift)
            case 39: // Right  (Shift)
            case 76: // L (Shift)
            case 74: // J (Shift)
            case 78: // N (Shift)
                action = event.shiftKey ? 'nextSlide' : 'next';
                break;

            case 36: // Home
                allowModifiers = true;
                action = 'first';
                break;

            case 35: // End
                allowModifiers = true;
                action = 'last';
                break;

            case 32: // Space (Shift)
                if (this._shower.container.isSlideMode()) {
                    action = event.shiftKey ? 'prev' : 'next';
                }
                break;
        }

        if (action && (allowModifiers || !event.altKey && !event.ctrlKey && !event.metaKey)) {
            event.preventDefault();
            this[action]();
        }
    }

    _onSlideModeEnter() {
        if (!this._currentSlide) {
            this.go(0);
        }
    }
}

export default Player;
