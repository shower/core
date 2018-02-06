import { EventTarget, readOnly } from '../utils';

/**
 * Slide class.
 *
 * @param {HTMLElement} element
 * @param {object} [options]
 */
class Slide extends EventTarget {
    constructor(element, options) {
        super();
        readOnly(this, {
            element,
            options,
            state: { visited: 0 },
        });

        this._isActive = false;
    }

    get title() {
        const titleElement = this.element.querySelector(this.options.titleElementSelector);
        return titleElement && titleElement.textContent;
    }

    get id() {
        return this.element.id;
    }

    get html() {
        return this.element.innerHTML;
    }

    get isActive() {
        return this._isActive;
    }

    get isVisited() {
        return this.state.visited > 0;
    }

    activate() {
        if (this._isActive) return;

        this._isActive = true;
        this.state.visited++;
        this.element.classList.add(this.options.activeClass);
        this.dispatchEvent(new Event('activate'));
    }

    deactivate() {
        if (!this._isActive) return;

        this._isActive = false;
        this.element.classList.replace(this.options.activeClass, this.options.visitedClass);
        this.dispatchEvent(new Event('deactivate'));
    }
}

export default Slide;
