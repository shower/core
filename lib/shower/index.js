import { EventTarget } from '../utils';
import defaultOptions from './default-options';
import Slide from './slide';
import Player from './player';
import Plugins from './plugins';

const ensureId = (slideElement, index) => {
    if (!slideElement.id) {
        slideElement.id = index + 1;
    }

    return slideElement;
};

/**
 * Core module of the Shower.
 *
 * @param {object} [options] Shower options.
 */
class Shower extends EventTarget {
    constructor(options) {
        this.options = Object.freeze({ ...defaultOptions, ...options });

        const containerSelector = this.options.container_selector;
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Shower container with selector '${containerSelector}' not found.`);
        }

        this._initPlayer();
        this._initMode();
        this.plugins = new Plugins(this);
    }

    _initPlayer() {
        const slides = [...this.container.querySelectorAll(this.options.slides_selector)]
            .filter(slideElement => !slideElement.hidden)
            .map(ensureId)
            .map(slideElement => new Slide(slideElement, this.options.slide));

        this.player = new Player(slides);
    }

    _initMode() {
        const fullMode = this.options.mode_full_classname;
        const listMode = this.options.mode_list_classname;

        if (this.container.classList.contains(fullMode)) {
            this.enterSlideMode();
        } else {
            this.container.classList.add(listMode);
        }
    }

    get isFullMode() {
        return this._mode === 'full';
    }

    get isListMode() {
        return this._mode === 'list';
    }

    /**
     * Slide fills the maximum area.
     */
    enterFullMode() {
        if (this.isFullMode) return this;

        this.container.classList.replace(
            this.options.mode_list_classname,
            this.options.mode_full_classname,
        );

        this._mode = 'full';
        this.dispatchEvent(new Event('modechange'));

        return this;
    }

    /**
     * Shower returns into list mode.
     */
    exitFullMode() {
        if (this.isListMode) return this;

        this.container.classList.replace(
            this.options.mode_full_classname,
            this.options.mode_list_classname,
        );

        this._mode = 'list';
        this.scrollToCurrentSlide();
        this.dispatchEvent(new Event('modechange'));

        return this;
    }

    scrollToCurrentSlide() {
        const slide = this.player.currentSlide;
        if (slide) {
            slide.element.scrollIntoView();
        }

        return this;
    }
}

export default Shower;
