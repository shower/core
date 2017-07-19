import EventEmitter from '../emitter';

const getTransformScale = () => {
    const factor = 1 / Math.max(
        document.body.clientWidth / innerWidth,
        document.body.clientHeight / innerHeight
    );

    return `scale(${factor})`;
};

const applyTransform = value => {
    document.body.style.transform = value;
};

/**
 * @class
 * @name Container
 *
 * Container class for shower slides. Contains DOM,
 * enter & exit slide mode.
 *
 * @param {Shower} shower Shower.
 * @param {HTMLElement} containerEl Container element.
 */
class Container {
    constructor(shower, containerEl) {
        this.events = new EventEmitter({
            context: this,
            parent: shower.events,
        });

        this._shower = shower;
        this._element = containerEl;
        this._isSlideMode = false;

        this._key = `${shower.options.get('sessionstore_key')}-mode`;
        this._init();
        this._setupListeners();
    }

    _init() {
        const { options } = this._shower;
        const fullMode = options.get('mode_full_classname');
        const listMode = options.get('mode_list_classname');

        const cl = document.body.classList;
        if (cl.contains(fullMode) || sessionStorage[this._key] === 'full') {
            this.enterSlideMode();
        } else {
            cl.add(listMode);
        }
    }

    _setupListeners() {
        this._showerListeners = this._shower.events.group()
            .on('slideadd', this._onSlideAdd, this)
            .on('slideremove', this._onSlideRemove, this);

        document.addEventListener('keydown', this._onKeyDown.bind(this));

        window.addEventListener('resize', () => {
            if (this.isSlideMode()) {
                applyTransform(getTransformScale());
            }
        });
    }

    /**
     * @returns {HTMLElement} Container element.
     */
    getElement() {
        return this._element;
    }

    /**
     * Enter slide mode.
     * Slide fills the maximum area.
     *
     * @returns {Container}
     */
    enterSlideMode() {
        if (this._isSlideMode) return this;

        const cl = document.body.classList;
        const { options } = this._shower;

        cl.remove(options.get('mode_list_classname'));
        cl.add(options.get('mode_full_classname'));
        sessionStorage[this._key] = 'full';

        document.body.setAttribute('role', 'application');

        applyTransform(getTransformScale());
        this._isSlideMode = true;
        this.events.emit('modechange');

        return this;
    }

    /**
     * Exit slide mode.
     * Shower returns into list mode.
     *
     * @returns {Container}
     */
    exitSlideMode() {
        if (!this._isSlideMode) return this;

        const cl = document.body.classList;
        const { options } = this._shower;

        cl.remove(options.get('mode_full_classname'));
        cl.add(options.get('mode_list_classname'));
        sessionStorage[this._key] = 'list';

        document.body.removeAttribute('role');

        applyTransform('none');
        this.scrollToCurrentSlide();
        this._isSlideMode = false;
        this.events.emit('modechange');

        return this;
    }

    /**
     * Return state of slide mode.
     *
     * @returns {Boolean} Slide mode state.
     */
    isSlideMode() {
        return this._isSlideMode;
    }

    /**
     * Scroll to current slide.
     *
     * @returns {Container}
     */
    scrollToCurrentSlide() {
        const activeSlideClass = this._shower.options.get('slide_active_classname');
        const slideEl = this._element.querySelector(`.${activeSlideClass}`);
        if (slideEl) {
            slideEl.scrollIntoView();
        }

        return this;
    }

    _onSlideAdd(event) {
        const slide = event.get('slide');
        slide.events.on('click', this.enterSlideMode, this);
    }

    _onSlideRemove(event) {
        const slide = event.get('slide');
        slide.events.off('click', this.enterSlideMode, this);
    }

    _onKeyDown(event) {
        if (!this._shower.isHotkeysEnabled()) return;

        switch (event.key.toLowerCase()) {
            case 'enter':
                event.preventDefault();
                if (!this.isSlideMode() && event.metaKey) {
                    if (event.shiftKey) {
                        this._shower.player.first();
                    }

                    this.enterSlideMode();
                } else if (event.shiftKey) {
                    this._shower.player.prev();
                } else {
                    this._shower.player.next();
                }

                break;

            case 'escape':
                event.preventDefault();
                this.exitSlideMode();
                break;

            case 'p':
                if (!this.isSlideMode() && event.altKey && event.metaKey) {
                    event.preventDefault();
                    this.enterSlideMode();
                }
                break;

            case 'f5':
                if (!this.isSlideMode() && event.shiftKey) {
                    event.preventDefault();
                    this.enterSlideMode();
                }
                break;
        }
    }
}

export default Container;
