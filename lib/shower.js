import defaultOptions from './default-options';
import Slide from './slide';
import { EventTarget } from './utils';
import installModules from './modules';

const ensureSlideId = (slideElement, index) => {
    if (!slideElement.id) {
        slideElement.id = index + 1;
    }
};

class Shower extends EventTarget {
    constructor(options) {
        super();

        this.options = {
            ...defaultOptions,
            ...options,
        };

        const { containerSelector } = this.options;
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Shower container with selector '${containerSelector}' not found.`);
        }

        this._mode = 'undefined';
        this._initSlides();

        installModules(this);
    }

    _initSlides() {
        const slideElements = [ ...this.container.querySelectorAll(this.options.slideSelector) ]
            .filter(slideElement => !slideElement.hidden);

        slideElements.forEach(ensureSlideId);

        this.slides = slideElements.map(slideElement => new Slide(slideElement, this.options));
        this.slides.forEach(slide => {
            slide.addEventListener('activate', () => {
                const { currentSlide } = this;
                if (currentSlide !== slide) {
                    currentSlide.deactivate();
                    this.dispatchEvent(new Event('slidechange'));
                }
            });
        });
    }

    get isFullMode() {
        return this._mode === 'full';
    }

    get isListMode() {
        return this._mode === 'list';
    }

    get activeSlide() {
        return this.slides.find(slide => slide.isActive);
    }

    get currentSlideIndex() {
        return this.slides.findIndex(slide => slide.isActive);
    }

    /**
     * Slide fills the maximum area.
     */
    enterFullMode() {
        if (!this.isFullMode) {
            this._mode = 'full';
            this.dispatchEvent(new Event('modechange'));
        }
    }

    /**
     * Shower returns into list mode.
     */
    enterListMode() {
        if (!this.isListMode) {
            this._mode = 'list';
            this.dispatchEvent(new Event('modechange'));
        }
    }

    goTo(index) {
        const slide = this.slides[index];
        if (slide) {
            slide.activate();
        }
    }

    go(delta) {
        this.goTo(this.currentSlideIndex + delta);
    }

    prev(cancelable) {
        const prev = new Event('prev', { cancelable });
        if (this.dispatchEvent(prev)) {
            this.go(-1);
        }
    }

    next(cancelable) {
        const next = new Event('next', { cancelable });
        if (this.dispatchEvent(next)) {
            this.go(1);
        }
    }

    first() {
        this.goTo(0);
    }

    last() {
        this.goTo(this.slides.length - 1);
    }
}

export default Shower;
