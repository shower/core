export default shower => {
    const liveRegion = document.createElement('section');

    liveRegion.className = 'region';
    liveRegion.setAttribute('role', 'region');
    liveRegion.setAttribute('aria-live', 'polite');

    document.body.appendChild(liveRegion);

    const updateLiveRegion = () => {
        const container = shower.container.getElement();
        const region = container.querySelector('.slide[role="region"]');

        if (region) {
            region.removeAttribute('role');
        }

        const slide = shower.player.getCurrentSlide();

        if (slide) {
            const slideEl = slide.getElement();
            slideEl.setAttribute('role', 'region');
            slideEl.focus();
        }
    };

    const handleModeChange = () => {
        if (shower.container.isSlideMode()) {
            liveRegion.textContent = 'You are in the slide mode';
        } else {
            liveRegion.textContent = 'You are in the list mode';
        }
    };

    shower.getSlides().forEach(slide => {
        const slideEl = slide.getElement();
        slideEl.setAttribute('tabindex', 0);
    });

    shower.player.events.on('activate', updateLiveRegion);
    updateLiveRegion();

    shower.container.events.on('modechange', handleModeChange);
    handleModeChange();
};
