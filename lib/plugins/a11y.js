import { isMac, isMetaEl, getFocusableElements } from '../utils';

export default shower => {
    const liveRegion = document.createElement('section');

    liveRegion.className = 'region';
    liveRegion.setAttribute('role', 'region');
    liveRegion.setAttribute('aria-live', 'assertive');

    document.body.appendChild(liveRegion);

    /**
     * Creates slide title.
     *
     * @param {Slide} slide
     * @returns {string}
     */
    const getTitle = slide => {
        if (!slide) return '';

        const slideIndex = shower.getSlideIndex(slide);
        const slideCount = shower.getSlidesCount();
        const keyCommand = getKeyCommand();

        return `${slide.getTitle() || ''} Slide ${slideIndex + 1} of ${slideCount}. ${keyCommand}`;
    };

    /**
     * Generates a proper key command depending on:
     *
     *      - operating system (Cmd/Ctrl)
     *      - slide/grid mode
     *      - selected/not selected slide
     *
     * @todo i18n
     * @returns {string}
     */
    const getKeyCommand = () => {
        if (!shower.player.getCurrentSlide()) {
            return 'Click arrow keys to select a slide.';
        }

        if (shower.container.isSlideMode()) {
            return 'You are in the slide mode. Click Escape to exit.';
        }

        const shortcut = isMac() ? 'Command + Enter' : 'Shift + F5';

        return `Click ${shortcut} to enter slide mode`;
    };

    /**
     * Makes slide content accessible by AT.
     *
     * @param {HTMLElement} slideEl slide element
     */
    const showContent = slideEl => {
        [].slice.call(slideEl.children).forEach(el => {
            if (!isMetaEl(el)) {
                el.removeAttribute('aria-hidden');
            }
        });
    };

    /**
     * Hides slide content from AT.
     *
     * @param {HTMLElement} slideEl slide element
     */
    const hideContent = slideEl => {
        [].slice.call(slideEl.children).forEach(el => {
            if (!isMetaEl(el)) {
                el.setAttribute('aria-hidden', true);
            }
        });
    };

    /**
     * Keeps all interactive elements in a slide focusable.
     *
     * @param {HTMLElement} slideEl slide element
     */
    const allowFocus = slideEl => {
        const focusable = getFocusableElements(slideEl);

        [].slice.call(focusable).forEach(el => {
            if (!isMetaEl(el)) {
                el.removeAttribute('tabindex');
            }
        });
    };

    /**
     * Makes all interactive elements in a slide unfocusable.
     *
     * @param {HTMLElement} slideEl slide element
     */
    const preventFocus = slideEl => {
        const focusable = getFocusableElements(slideEl);

        [].slice.call(focusable).forEach(el => {
            if (!isMetaEl(el)) {
                el.setAttribute('tabindex', -1);
            }
        });
    };

    const updateLiveRegion = () => {
        const slide = shower.player.getCurrentSlide();
        const title = getTitle(slide);

        liveRegion.innerHTML = title;
    };

    const updateContainer = () => {
        if (shower.container.isSlideMode()) {
            document.body.setAttribute('role', 'application');
        } else {
            document.body.removeAttribute('role');
        }
    };

    const handleSlideContent = () => {
        const slides = shower.getSlides();

        slides.forEach(slide => {
            const slideEl = slide.getElement();
            const title = getTitle(slide);

            slideEl.setAttribute('aria-label', title);

            /**
             * In a slide mode slides are fully accessible.
             * In a grid mode only slide descriptions are accessible (plus slide's pesudo elements).
             */
            if (shower.container.isSlideMode()) {
                showContent(slideEl);
                allowFocus(slideEl);
            } else {
                hideContent(slideEl);
                preventFocus(slideEl);
            }
        });
    };

    const handleModeChange = () => {
        handleSlideContent();
        updateContainer();
        updateLiveRegion();
    };

    shower.player.events.on('activate', updateLiveRegion);
    updateLiveRegion();

    shower.container.events.on('modechange', handleModeChange);
    handleModeChange();
};
