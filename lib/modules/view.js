export default shower => {
    const { container } = shower;
    const { fullModeClass, listModeClass } = shower.options;

    shower.addEventListener('modechange', () => {
        if (shower.isFullMode) {
            container.classList.add(fullModeClass);
            container.classList.remove(listModeClass);
        } else {
            container.classList.add(listModeClass);
            container.classList.remove(fullModeClass);

            const slide = shower.activeSlide;
            if (!slide) return;

            slide.element.scrollIntoView({ block: 'center' });
        }
    });

    shower.addEventListener('slidechange', () => {
        const slide = shower.activeSlide;
        slide.element.scrollIntoView({ block: 'nearest' });
    });
};
