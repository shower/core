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

            const slide = shower.currentSlide;
            if (slide) {
                slide.element.scrollIntoView({
                    block: 'nearest',
                });
            }
        }
    });
};
