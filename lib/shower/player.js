import { EventTarget } from '../utils';

class Player extends EventTarget {
    constructor(slides) {
        slides.forEach(slide => {
            slide.addEventListener('activate', () => {

            });
        });

        this._slides = slides;
        this._currentSlideIndex = -1;
    }

    prev() {
        const prev = new Event('prev', { cancelable: true });
        if (this.dispatchEvent(prev)) {
            this.go(this._currentSlideIndex - 1);
        }

        return this;
    }

    next() {
        const next = new Event('next', { cancelable: true });
        if (this.dispatchEvent(next)) {
            this.go(this._currentSlideIndex + 1);
        }

        return this;
    }

    first() {
        this.go(0);
        return this;
    }

    last() {
        this.go(this.slidesCount - 1);
        return this;
    }

    /**
     * Go to custom slide by index.
     *
     * @param {number} slide index to activate.
     */
    go(index) {
        const slide = this._slides[index];
        if (slide) {
            slide.activate();
        }

        return this;
    }

    get currentSlideIndex() {
        return this._currentSlideIndex;
    }

    get currentSlide() {
        return this._slides[this._currentSlideIndex];
    }

    get slideCount() {
        return this._slides.length;
    }
}

export default Player;
