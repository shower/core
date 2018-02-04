import { EventTarget } from '../utils';

class Player extends EventTarget {
    constructor(slides) {
        slides.forEach((slide, index) => {
            slide.addEventListener('activate', () => {
                if (this.currentSlide !== slide) {
                    this.currentSlide.deactivate();
                }

                this._currentSlideIndex = index;
            });
        });

        this.slides = Object.freeze(slides);
        this._currentSlideIndex = -1;
    }

    prev(cancelable) {
        const prev = new Event('prev', { cancelable });
        if (this.dispatchEvent(prev)) {
            this.go(this._currentSlideIndex - 1);
        }

        return this;
    }

    next(cancelable) {
        const next = new Event('next', { cancelable });
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
        const slide = this.slides[index];
        if (slide) {
            slide.activate();
        }

        return this;
    }

    get currentSlideIndex() {
        return this.slides.findIndex(slide => slide.isActive);
    }

    get currentSlide() {
        return this.slides.find(slide => slide.isActive);
    }
}

export default Player;
