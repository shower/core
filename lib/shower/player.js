import { EventTarget } from '../utils';

class Player extends EventTarget {
    constructor(slides) {
        super();
        slides.forEach(slide => {
            slide.addEventListener('activate', () => {
                const { currentSlide } = this;
                if (currentSlide !== slide) {
                    currentSlide.deactivate();
                    this.dispatchEvent(new Event('slidechange'));
                }
            });
        });

        this.slides = Object.freeze(slides);
    }

    get currentSlideIndex() {
        return this.slides.findIndex(slide => slide.isActive);
    }

    get currentSlide() {
        return this.slides.find(slide => slide.isActive);
    }

    prev(cancelable) {
        const prev = new Event('prev', { cancelable });
        if (this.dispatchEvent(prev)) {
            this.go(this.currentSlideIndex - 1);
        }
    }

    next(cancelable) {
        const next = new Event('next', { cancelable });
        if (this.dispatchEvent(next)) {
            this.go(this.currentSlideIndex + 1);
        }
    }

    first() {
        this.go(0);
    }

    last() {
        this.go(this.slides.length - 1);
    }

    go(index) {
        const slide = this.slides[index];
        if (slide) {
            slide.activate();
        }

    }
}

export default Player;
