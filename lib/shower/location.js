import { SessionStore } from '../utils';

/**
 * @class
 * @name Location
 * History controller for shower.
 *
 * @param {Shower} shower
 */
class Location {
    constructor(shower) {
        this._shower = shower;

        const sessionStoreKey = `${shower.options.get('sessionstore_key')}-shower.Location`;
        this.state = new SessionStore(sessionStoreKey, { isSlideMode: false });

        this._showerListeners = null;
        this._playerListeners = null;
        this._documentTitle = document.title;
        this._popStateProcess = null;

        this._setupListeners();
        this._init();
    }

    destroy() {
        this._clearListeners();
    }

    /**
     * Save current Shower state, e.g.:
     * - slide (index or id);
     * - slide mode.
     */
    save() {
        this.state.set('isSlideMode', this._isSlideMode());
    }

    _init() {
        const shower = this._shower;
        const currentSlideId = location.hash.slice(1);
        const slideModeClass = shower.options.get('mode_full_classname');

        // Need for first slide focus.
        location.hash = '';

        // Check state value and classList only when first initialization.
        if (this.state.get('isSlideMode') || document.body.classList.contains(slideModeClass)) {
            shower.container.enterSlideMode();
        }

        if (currentSlideId) {
            const { index = 0 } = this._getSlideById(currentSlideId);
            shower.player.go(index);
        }
    }

    _setupListeners() {
        this._onPopstate = this._onPopstate.bind(this);
        const shower = this._shower;

        this._playerListeners = shower.player.events.group()
            .on('activate', this._onSlideActivate, this);

        this._containerListener = shower.container.events.group()
            .on(['slidemodeenter', 'slidemodeexit'], this._onContainerSlideModeChange, this);

        window.addEventListener('popstate', this._onPopstate);
    }

    _clearListeners() {
        window.removeEventListener('popstate', this._onPopstate);
        this._playerListeners.offAll();
        this._containerListener.offAll();
    }

    /**
     * @ignore
     * @param {string} id
     * @return {slideInfo} Slide info object.
     */
    _getSlideById(id) {
        const slides = this._shower.getSlides();

        for (const [index, slide] of slides.entries()) {
            if (slide.getId() === id) {
                return { index, slide };
            }
        }

        return {};
    }

    _onSlideActivate(event) {
        location.hash = event.get('slide').getId();
        this._setTitle();
    }

    _onContainerSlideModeChange() {
        this._setTitle();
        this.save();
    }

    _isSlideMode() {
        return this._shower.container.isSlideMode();
    }

    _onPopstate() {
        const { player } = this._shower;
        const slideId = location.hash.slice(1);
        const currentSlide = player.getCurrentSlide();
        const currentSlideNumber = player.getCurrentSlideIndex();

        if (currentSlideNumber === -1) {
            // Go to first slide, if hash id is invalid or isn't set.
            // In List mode, go to first slide only if hash id is invalid.
            if (this._isSlideMode() || location.hash) {
                player.go(0);
            }
        } else if (currentSlide.getId() !== slideId) {
            const { index } = this._getSlideById(slideId);
            player.go(index);
        }
    }

    _setTitle() {
        const { title } = document;
        const isSlideMode = this._isSlideMode();
        const currentSlide = this._shower.player.getCurrentSlide();

        if (isSlideMode && currentSlide) {
            const slideTitle = currentSlide.getTitle();

            document.title = slideTitle
                ? `${slideTitle} — ${this._documentTitle}`
                : this._documentTitle;
        } else if (this._documentTitle !== title) {
            document.title = this._documentTitle;
        }
    }
}

export default Location;
